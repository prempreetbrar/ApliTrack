import React from "react";

import { Box } from "@mui/material";
import UserSection from "./UserSection";
import SimpleSection from "./SimpleSection";
import FormSection from "./FormSection";

import useAuthContext from "../../hooks/useAuthContext";
import { useGet } from "../../hooks/useHttpMethod";
import MainBox from "components/MainBox";

export default function Profile() {
  const { user } = useAuthContext();
  const [applicantInfo, setApplicantInfo] = React.useState(null);
  const { executeRequest: get, isLoading } = useGet();

  /*
    Get the applicant's info upon loading the page (and anytime
    the user themselves changes, for example if someone goes into
    the backend and changes a column themselves).  
    )
  */
  React.useEffect(() => {
    const fetchApplicantInfo = async () => {
      const response = await get(
        {},
        "http://localhost:3000/api/applicants/profile"
      );
      setApplicantInfo(response?.applicant);
    };

    if (user) {
      fetchApplicantInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <MainBox isLoading={isLoading}>
      {/* YOU */}
      <UserSection applicantInfo={applicantInfo} />
      {/* EXPERIENCES */}
      <FormSection
        sectionName={"EXPERIENCES"}
        sectionURL={"http://localhost:3000/api/applicants/experiences"}
        sectionArray={applicantInfo?.Experiences}
        attributeName="Experience"
        attributeDescName="ExperienceDesc"
      />
      {/* PROJECTS */}
      <FormSection
        sectionName={"PROJECTS"}
        sectionURL={"http://localhost:3000/api/applicants/projects"}
        sectionArray={applicantInfo?.Projects}
        attributeName="Project"
        attributeDescName="ProjectDesc"
      />
      {/* CERTIFICATIONS */}
      <SimpleSection
        sectionName={"CERTIFICATIONS"}
        sectionURL={"http://localhost:3000/api/applicants/certifications"}
        sectionArray={applicantInfo?.Certifications}
        attributeName="Certification"
      />
      {/* SKILLS */}
      <SimpleSection
        sectionName={"SKILLS"}
        sectionURL={"http://localhost:3000/api/applicants/skills"}
        sectionArray={applicantInfo?.Skills}
        attributeName="Skill"
      />
      {/* COMPETITION */}
      <SimpleSection
        sectionName={"COMPETITIONS"}
        sectionURL={"http://localhost:3000/api/applicants/competitions"}
        sectionArray={applicantInfo?.Competitions}
        attributeName="Competition"
      />
    </MainBox>
  );
}
