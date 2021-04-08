import React, { useReducer, useState, useEffect } from "react";
import { withRouter } from "react-router";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";

import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import MenuItem from "@material-ui/core/MenuItem";

import { makeStyles } from "@material-ui/core/styles";

import Loader from "components/Common/Loader";

import clsx from "clsx";

import { GET_UMAMUSUME } from "queries/umamusume";
import { GET_CARD, EDIT_CARD } from "queries/cards";
import { EDIT_SKILLS, GET_SKILLS } from "queries/skills";
import { stars, cardTypes, initialStatusData, supportTypes } from "./constants";

import SearchUmamusume from "../Umamusume/SearchUmamusume";
import SearchSkills from "../Skills/SearchSkills";
import CardStatus from "./CardStatus";
import CardEventForm from "./CardEventForm/Form";
import CardBonusForm from "./CardBonusForm/Form";
import SkillIcons from "./SkillIcons";

const getImageName = (imageSrc) => {
  try {
    return imageSrc.split("/").pop().split(".")[0];
  } catch (_err) {
    return "";
  }
};

const useStyles = makeStyles((_theme) => ({
  root: {
    maxWidth: "800px",
    margin: "15px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    padding: "10px",
  },
  button: {
    marginBottom: "16px",
  },
  card: {
    width: "100px",
    height: "100px",
    border: "5px solid #ebd834",
    boxSizing: "border-box",
    backgroundPosition: "top center",
    backgroundSize: "80%",
    backgroundRepeat: "no-repeat",
    marginBottom: "10px",
  },
  skillWrapper: {
    display: "flex",
    justifyContent: "space-between",
  },
  skillButton: {
    width: "calc(33% - 8px)",
    marginBottom: "16px",
  },
}));

const EditCard = (props) => {
  const classes = useStyles();
  const { id } = useParams();

  const { loading, error, data } = useQuery(GET_CARD, {
    variables: { id },
  });

  const [isTrainingType, setTrainingType] = useState(true);
  const [targetInfo, setTarget] = useState(null);
  const [modalOpened, setModalState] = useState(false);
  const [skillSearchModalOpened, setSkillSearchModalState] = useState(false);
  const [relatedSkills, setRelatedSkills] = useState({
    unique: [],
    training: [],
    has: [],
  });
  const [selectedSkillType, setSelectedSkillType] = useState("");

  const [getTargetInfo, { data: targetData }] = useLazyQuery(GET_UMAMUSUME);

  const [editCard, _mutationData] = useMutation(EDIT_CARD);
  const [editSkills, _mutationSkillsData] = useMutation(EDIT_SKILLS);

  const [formData, setFormInput] = useReducer(
    (state, newState) => ({
      ...state,
      ...newState,
    }),
    {
      name: "",
      star: 1,
      targetID: null,
      imageSrc: "",
      type: "training",
      playable: false,
      supportType: "",
      limited: false,
      events: {
        common: [],
        once: [],
        multipleTimes: [],
      },
      bonus: {
        unique: [],
        support: [],
      },
    }
  );

  const [statusData, setStatusInput] = useReducer(
    (state, newState) => ({
      ...state,
      ...newState,
    }),
    {
      turf: initialStatusData,
      duct: initialStatusData,
      short: initialStatusData,
      mile: initialStatusData,
      medium: initialStatusData,
      long: initialStatusData,
      escape: initialStatusData,
      leading: initialStatusData,
      between: initialStatusData,
      pushing: initialStatusData,
      speed: initialStatusData,
      stamina: initialStatusData,
      power: initialStatusData,
      guts: initialStatusData,
      intelligence: initialStatusData,
    }
  );

  const setInitData = () => {
    if (data && data.card) {
      const {
        name,
        status,
        imageSrc,
        events,
        skills,
        bonus,
        playable,
        uniqueSkillsIds,
        trainingSkillsIds,
        hasSkillsIds,
        ...others
      } = card;
      const imageName = getImageName(imageSrc);

      setFormInput({
        ko: name.ko,
        ja: name.ja,
        imageSrc,
        imageName,
        events: addEventTempIDs(events),
        bonus: addBonusTempIDs(bonus),
        playable,
        ...others,
      });

      setTrainingType(playable);
      setStatusInput({
        ...status.ground,
        ...status.distance,
        ...status.strategy,
        ...status.status,
      });

      const uniqueSkills = [];
      const traniningSkills = [];
      const hasSkills = [];

      skills.forEach((item) => {
        if (uniqueSkillsIds.includes(item.id)) {
          uniqueSkills.push(item);
        } else if (trainingSkillsIds.includes(item.id)) {
          traniningSkills.push(item);
        } else if (hasSkillsIds.includes(item.id)) {
          hasSkills.push(item);
        }
      });

      setRelatedSkills({
        unique: uniqueSkills,
        training: traniningSkills,
        has: hasSkills,
      });
      if (targetData) {
        setTarget(targetData.umamusume || null);
      }
    }
  };

  useEffect(() => {
    setInitData();
    if (data?.card.targetID && !targetData) {
      getTargetInfo({ variables: { id: data.card.targetID } });
    }
  }, [data, targetData]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "type") {
      if (value === "training") {
        setTrainingType(true);
      } else {
        setTrainingType(false);
      }
    }
    setFormInput({ [name]: value });
  };

  const handleChangeCheckbox = (e) => {
    const name = e.target.name;
    const value = e.target.checked;

    if (name === "playable") {
      setTrainingType(value);
    }
    setFormInput({ [name]: value });
  };

  const handleStatusChange = (e) => {
    const [type, status] = e.target.name.split("-");
    const value = e.target.value.toString();

    const newState = { ...statusData[type], [status]: value };
    setStatusInput({ [type]: newState });
  };

  const handleChangeEvents = (eventData) => {
    setFormInput({ events: eventData });
  };

  const handleUpdateBonus = (bonusData) => {
    setFormInput({ bonus: { ...bonusData } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const {
      turf,
      duct,
      short,
      mile,
      medium,
      long,
      escape,
      leading,
      between,
      pushing,
      ...others
    } = statusData;

    const { ko, ja, type, imageName, events, bonus, ...formDatas } = formData;

    const imageSrc =
      targetInfo && imageName
        ? `/image/${targetInfo.name.default}/cards/${type}/${imageName}.png`
        : "/image/temp.png";

    const input = {
      ...formDatas,
      name: { ko, ja },
      type,
      imageSrc,
      targetID: targetInfo?.id,
      events: removeEventTempIDs(events),
      bonus: removeBonusTempIDs(bonus),
      uniqueSkillsIds: relatedSkills.unique.map(({ id }) => id),
      trainingSkillsIds: relatedSkills.training.map(({ id }) => id),
      hasSkillsIds: relatedSkills.has.map(({ id }) => id),
      status: {
        ground: {
          turf,
          duct,
        },
        distance: {
          short,
          mile,
          medium,
          long,
        },
        strategy: {
          escape,
          leading,
          between,
          pushing,
        },
        status: others,
      },
    };

    editCard({
      variables: {
        id,
        input,
      },
      refetchQueries: [
        {
          query: GET_CARD,
          variables: { id: id },
        },
      ],
      awaitRefetchQueries: true,
    }).then(({ data }) => {
      const { editCard } = data;
      const params = {
        addIds: [],
        addTargetIDs: [],
        deleteIds: [],
        deleteTargetIDs: [],
      };

      const skillList = [
        ...relatedSkills.unique,
        ...relatedSkills.training,
        ...relatedSkills.has,
      ];

      _.pullAll(skillList, editCard.skills).forEach((item) => {
        params.addIds.push(item.id);
        params.addTargetIDs.push(_.uniq([...item.targetIDs, editCard.id]));
      });

      _.differenceBy(editCard.skills, skillList, "id").forEach((target) => {
        params.deleteIds.push(target.id);
        params.deleteTargetIDs.push(
          _.remove(target.targetIDs, (tid) => tid !== editCard.id)
        );
      });

      editSkills({
        variables: {
          ...params,
        },
        refetchQueries: [{ query: GET_SKILLS }],
      }).then(() => {
        props.history.push(`/cards/${editCard.id}`);
      });
    });
  };

  const addEventTempIDs = (events) => {
    const once = events.once.map((d) => ({
      ...d,
      __tempID: _.uniqueId("bonus-data"),
    }));
    const multipleTimes = events.multipleTimes.map((d) => ({
      ...d,
      __tempID: _.uniqueId("bonus-data"),
    }));

    return {
      once,
      multipleTimes,
      common: events.common,
    };
  };

  const removeBonusTempIDs = (bonus) => {
    const unique = bonus.unique.map((d) => _.omit(d, ["__tempID"]));
    const support = bonus.support.map((d) => _.omit(d, ["__tempID"]));

    return {
      unique,
      support,
    };
  };

  const addBonusTempIDs = (bonus) => {
    const unique = bonus.unique.map((d) => ({
      ...d,
      __tempID: _.uniqueId("unique"),
    }));
    const support = bonus.support.map((d) => ({
      ...d,
      __tempID: _.uniqueId("support"),
    }));

    return {
      unique,
      support,
    };
  };

  const removeEventTempIDs = (events) => {
    const once = events.once.map((d) => _.omit(d, ["__tempID"]));
    const multipleTimes = events.multipleTimes.map((d) =>
      _.omit(d, ["__tempID"])
    );

    return {
      once,
      multipleTimes,
      common: events.common,
    };
  };

  const showSearchModal = () => {
    setModalState(true);
  };
  const hideSearchModal = () => {
    setModalState(false);
  };

  const showSkillSearchModal = () => {
    setSkillSearchModalState(true);
  };
  const hideSkillSearchModal = () => {
    setSkillSearchModalState(false);
  };

  const handleSelect = (targets) => {
    setRelatedSkills({ ...relatedSkills, [selectedSkillType]: targets });
  };
  const showUniqueSkillSearchModal = () => {
    setSelectedSkillType("unique");
    showSkillSearchModal();
  };
  const showTrainingSkillSearchModal = () => {
    setSelectedSkillType("training");
    showSkillSearchModal();
  };
  const showHasSkillSearchModal = () => {
    setSelectedSkillType("has");
    showSkillSearchModal();
  };

  if (loading) return <Loader />;

  const { card } = data;
  if (error || !card) return <p>Error :(</p>;

  return (
    <form onSubmit={handleSubmit} className={clsx(classes.form)}>
      <FormControl>
        <TextField
          className={clsx(classes.root)}
          required
          id="name-ja"
          name="ja"
          label="카드이름 (일본어)"
          defaultValue={card.name.ja}
          onChange={handleChange}
        />
        <TextField
          className={clsx(classes.root)}
          id="name-ko"
          name="ko"
          label="카드이름 (한국어)"
          defaultValue={card.name.ko}
          onChange={handleChange}
        />
        <TextField
          className={clsx(classes.root)}
          id="imageName"
          name="imageName"
          label="이미지 파일 이름"
          defaultValue={getImageName(card.imageSrc)}
          onChange={handleChange}
        />
        <TextField
          className={clsx(classes.root)}
          required
          select
          id="star"
          name="star"
          value={formData.star}
          label="등급"
          onChange={handleChange}
        >
          {stars.map((option) => (
            <MenuItem key={`star-${option.value}`} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          className={clsx(classes.root)}
          required
          select
          value={formData.type || "training"}
          id="type"
          name="type"
          label="카드 종류"
          onChange={handleChange}
        >
          {cardTypes.map((option) => (
            <MenuItem key={`type-${option.value}`} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.limited}
              onChange={handleChangeCheckbox}
              name="limited"
            />
          }
          label="한정 여부"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.playable}
              onChange={handleChangeCheckbox}
              name="playable"
            />
          }
          label="육성 가능"
        />

        {!isTrainingType && (
          <TextField
            className={clsx(classes.root)}
            required
            select
            value={formData.supportType || "supportType"}
            id="supportType"
            name="supportType"
            label="카드 적성"
            onChange={handleChange}
          >
            {supportTypes.map((option) => (
              <MenuItem key={`type-${option.value}`} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        )}

        {isTrainingType ? (
          <CardStatus data={statusData} onChange={handleStatusChange} />
        ) : (
          <CardBonusForm
            initialData={formData.bonus}
            onChangeBonus={handleUpdateBonus}
          />
        )}

        <CardEventForm
          onChangeEvents={handleChangeEvents}
          initialData={formData.events}
        />

        {targetInfo && (
          <div
            className={classes.card}
            style={{
              backgroundImage: `url(${targetInfo.imageSrc})`,
            }}
          ></div>
        )}

        <Button
          type="button"
          variant="outlined"
          color="primary"
          onClick={showSearchModal}
          className={classes.button}
        >
          관련된 우마무스메 선택
        </Button>

        {modalOpened && (
          <SearchUmamusume
            open
            selectedData={targetInfo}
            onSelect={setTarget}
            onClose={hideSearchModal}
          />
        )}

        {relatedSkills.unique.length > 0 && (
          <div>
            <b>고유 스킬</b>
            {relatedSkills.unique.map((skillData, index) => (
              <SkillIcons
                name={skillData.name}
                imageSrc={skillData.imageSrc}
                effect={skillData.effect}
                key={`skill_${index}`}
              />
            ))}
          </div>
        )}

        {relatedSkills.training.length > 0 && (
          <div>
            <b>육성 스킬</b>
            {relatedSkills.training.map((skillData, index) => (
              <SkillIcons
                name={skillData.name}
                imageSrc={skillData.imageSrc}
                effect={skillData.effect}
                key={`skill_${index}`}
              />
            ))}
          </div>
        )}

        {relatedSkills.has.length > 0 && (
          <div>
            <b>소지 스킬</b>
            {relatedSkills.has.map((skillData, index) => (
              <SkillIcons
                name={skillData.name}
                imageSrc={skillData.imageSrc}
                effect={skillData.effect}
                key={`skill_${index}`}
              />
            ))}
          </div>
        )}

        <div className={classes.skillWrapper}>
          <Button
            type="button"
            variant="outlined"
            color="primary"
            onClick={showUniqueSkillSearchModal}
            className={classes.skillButton}
          >
            고유 스킬 선택
          </Button>
          <Button
            type="button"
            variant="outlined"
            color="primary"
            onClick={showTrainingSkillSearchModal}
            className={classes.skillButton}
          >
            육성 스킬 선택
          </Button>
          <Button
            type="button"
            variant="outlined"
            color="primary"
            onClick={showHasSkillSearchModal}
            className={classes.skillButton}
          >
            소지 스킬 선택
          </Button>
        </div>

        {skillSearchModalOpened && (
          <SearchSkills
            open
            selectedData={relatedSkills[selectedSkillType]}
            onSelect={handleSelect}
            onClose={hideSkillSearchModal}
          />
        )}

        <Button
          type="submit"
          className={clsx(classes.button)}
          variant="contained"
          color="primary"
        >
          제출
        </Button>
      </FormControl>
    </form>
  );
};

export default withRouter(EditCard);
