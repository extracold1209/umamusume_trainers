import React, { useReducer } from "react";
import { withRouter } from "react-router";
import { useMutation } from "@apollo/client";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import clsx from "clsx";

import { GET_UMAMUSUMES, ADD_UMAMUSUME } from "queries/umamusume";

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
    width: "100px",
    margin: "1rem",
  },
}));

const AddUmamusume = (props) => {
  const classes = useStyles();
  const [addUmamusume, _mutationData] = useMutation(ADD_UMAMUSUME);
  const [formData, setFormInput] = useReducer(
    (state, newState) => ({
      ...state,
      ...newState,
    }),
    {
      ko: "",
      ja: "",
      en: "",
      cards: [],
    }
  );

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormInput({ [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { ko, ja, en, cards } = formData;
    const removeSpace = en.replace(/\s/g, "").trim();
    const input = {
      name: { ko, ja, en, default: removeSpace },
      cards,
      imageSrc: `/image/${removeSpace}/main.png`,
    };

    addUmamusume({
      variables: {
        input,
      },
      refetchQueries: [{ query: GET_UMAMUSUMES }],
      awaitRefetchQueries: true,
    }).then(() => {
      props.history.push("/umamusume");
    });
  };

  return (
    <form onSubmit={handleSubmit} className={clsx(classes.form)}>
      <FormControl>
        <TextField
          className={clsx(classes.root)}
          required
          id="name-ko"
          name="ko"
          label="한국어 이름"
          onChange={handleChange}
        />
        <TextField
          className={clsx(classes.root)}
          required
          id="name-ja"
          name="ja"
          label="일본어 이름"
          onChange={handleChange}
        />
        <TextField
          className={clsx(classes.root)}
          required
          id="name-en"
          name="en"
          label="영문 이름"
          onChange={handleChange}
        />
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

export default withRouter(AddUmamusume);
