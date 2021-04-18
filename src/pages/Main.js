import React from "react";
import { Link } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((_theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  logo: {
    width: "200px",
  },
  links: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    textAlign: "center",
    marginTop: "24px",
  },
  linkItem: {
    display: "flex",
    justifyContent: "center",
  },
}));

const Main = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <h1>우마무스메 트레이너스</h1>

      <img
        className={classes.logo}
        src="/image/logo.png"
        alt="umamusume-logo"
      />
      <div className={classes.links}>
        <List component="ul">
          <ListItem classes={{ root: classes.linkItem }}>
            <Link to="/umamusume">
              <ListItemText primary="우마무스메 리스트" />
            </Link>
          </ListItem>
          <ListItem classes={{ root: classes.linkItem }}>
            <Link to="/cards">
              <ListItemText primary="육성/서포터 카드 리스트" />
            </Link>
          </ListItem>
          <ListItem classes={{ root: classes.linkItem }}>
            <Link to="/skills">
              <ListItemText primary="스킬 리스트" />
            </Link>
          </ListItem>
          <ListItem classes={{ root: classes.linkItem }}>
            <Link to="/deck-builder">
              <ListItemText primary="덱 빌더" />
            </Link>
          </ListItem>
        </List>
      </div>
    </div>
  );
};

export default Main;
