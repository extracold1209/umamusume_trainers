import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((_theme) => ({
  wrapper: {
    display: "flex",
    marginBottom: "36px",
  },
  input: {
    width: "100%",
  },
  searchBtn: {
    marginLeft: "16px",
  },
}));

export default function SearchForm({ data, handleSearch }) {
  const classes = useStyles();
  const [keyword, setKeyword] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setKeyword(value);
  };

  const onSearch = () => {
    const searchData = keyword
      ? data.filter(({ name }) => {
          return name?.ko?.includes(keyword) || name?.ja?.includes(keyword);
        })
      : data;
    handleSearch(searchData);
  };

  return (
    <div className={classes.wrapper}>
      <TextField
        classes={{ root: classes.input }}
        onChange={handleChange}
        onBlur={handleChange}
        label="이름 입력"
        id="search"
      />
      <Button
        className={classes.searchBtn}
        variant="contained"
        color="primary"
        onClick={onSearch}
      >
        검색
      </Button>
    </div>
  );
}
