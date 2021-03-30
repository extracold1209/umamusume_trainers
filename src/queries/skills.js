import { gql } from "@apollo/client";

export const GET_SKILLS = gql`
  query {
    skills {
      id
      name
      targetIDs
      effect
      imageSrc
      type
      tags
    }
  }
`;

export const GET_SKill = gql`
  query Sklills($id: ID!) {
    skill(id: $id) {
      id
      name
      targetIDs
      effect
      imageSrc
      type
      tags
    }
  }
`;

export const ADD_Sklill = gql`
  mutation AddSkill($input: SkillInputType) {
    addSkill(input: $input) {
      id
      name
      targetIDs
      effect
      imageSrc
      type
      tags
    }
  }
`;

export const EDIT_SKILL = gql`
  mutation EditSkill($id: ID!, $input: SkillInputType) {
    editSkill(id: $id, input: $input) {
      id
      name
      targetIDs
      effect
      imageSrc
      type
      tags
    }
  }
`;

export const EDIT_SKILLS = gql`
  mutation EditSkillS($ids: [ID] $skillsTargetIDs: [[String]]) {
    editSkills(ids:$ids skillsTargetIDs: $skillsTargetIDs) {
      id
      name
      targetIDs
    }
  }
`;

export const DELTE_Skill = gql`
  mutation DeleteSkill($id: ID!) {
    deleteSkill(id: $id) {
      id
    }
  }
`;
