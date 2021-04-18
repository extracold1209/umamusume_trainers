import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Divider from "@material-ui/core/Divider";
import Collapse from "@material-ui/core/Collapse";

const useStyles = makeStyles((_theme) => ({
  objectWrapper: {
    display: "flex",
    flexDirection: "column",
  },
  itemWrapper: {
    display: "flex",
    flexDirection: "column",
    border: "1px solid #666666",
  },
  object: {
    textAlign: "center",
    backgroundColor: "#666666",
    color: "white",
    fontWeight: "bold",
    padding: "8px",
  },
  detailRow: {
    padding: "8px",
  },
  arrowIcon: {
    margin: "auto",
  },
}));

const TrainingItem = ({ data, index, isLast, checkable, checked }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(checkable || checked || true);
  const hasCondition = Boolean(data.time || data.fan || data.raceCourse);
  const handleCheck = () => {
    if (checkable) {
      setOpen(!open);
    }
  };
  return (
    <div className={classes.objectWrapper}>
      <div className={classes.itemWrapper}>
        <div className={classes.object} onClick={handleCheck}>
          목표 {index + 1}
        </div>
        <div>
          <div className={classes.detailRow}>{data.object}</div>
          {hasCondition && <Divider />}
          <Collapse in={open} timeout="auto" unmountOnExit>
            <div className={classes.detailRow}>
              {data.time && <div>시기: {data.time}</div>}
              {data.fan && <div>팬: {data.fan}</div>}
              {data.raceCourse && <div>경기장: {data.raceCourse}</div>}
            </div>
          </Collapse>
        </div>
      </div>
      {!isLast && <ArrowDropDownIcon className={classes.arrowIcon} />}
    </div>
  );
};

export default function TrainingObjects({ data }) {
  const classes = useStyles();
  const listLength = data.length - 1;
  return (
    <div>
      {data.map((d, index) => {
        return (
          <TrainingItem
            data={d}
            key={`training-object-${index}`}
            index={index}
            isLast={listLength === index}
          />
        );
      })}
    </div>
  );
}

/* {hasCondition && (
          <IconButton onClick={hanldeExapnd}>
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        )} */
/* <Collapse in={open} timeout="auto" unmountOnExit>
        
      </Collapse> */
