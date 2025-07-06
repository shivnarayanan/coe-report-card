import { Project } from "@types/types";

export const mockProjects: Project[] = [
  {
    id: "1",
    title: "Project Alpha",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    status: "ACTIVE",
    tags: ["Compliance", "IWM"],
    whyWeBuiltThis:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    whatWeveBuilt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    individualsInvolved: [
      "Shiv Narayanan (Chief Data Office/SG)",
      "Lim Zhao Yu (Chief Data Office/SG)",
    ],
    timeline: [
      {
        id: "1-1",
        title: "Project Kickoff",
        description: "Initial project setup and team formation completed.",
        date: "January 15, 2024",
        isStepActive: false,
      },
      {
        id: "1-2",
        title: "Development Phase",
        description: "Core features development in progress. Team working on MVP features.",
        date: "February 15, 2024",
        isStepActive: true,
      },
      {
        id: "1-3",
        title: "Final Testing & QA",
        description: "Comprehensive testing completed. All critical issues resolved.",
        date: "March 10, 2024",
        isStepActive: false,
      },
      {
        id: "1-4",
        title: "Production Deployment",
        description: "Successfully deployed to production environment. All systems operational.",
        date: "March 20, 2024",
        isStepActive: false,
      },
    ],
  },
  {
    id: "2",
    title: "Project Beta",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    status: "PILOT",
    tags: ["Investment Banking"],
    whyWeBuiltThis:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    whatWeveBuilt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    individualsInvolved: [
      "Shiv Narayanan (Chief Data Office/SG)",
      "Lim Zhao Yu (Chief Data Office/SG)",
    ],
    timeline: [
      {
        id: "2-1",
        title: "Project Initiation",
        description: "Project requirements finalized and development team assembled.",
        date: "February 1, 2024",
        isStepActive: false,
      },
      {
        id: "2-2",
        title: "MVP Development",
        description: "Minimum viable product development completed. Ready for pilot testing.",
        date: "February 28, 2024",
        isStepActive: true,
      },
      {
        id: "2-3",
        title: "Pilot Testing",
        description: "Pilot phase initiated with select users. Gathering feedback and metrics.",
        date: "March 15, 2024",
        isStepActive: false,
      },
    ],
  },
  {
    id: "3",
    title: "Project Gamma",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    status: "MAINTENANCE",
    tags: ["Finance"],
    whyWeBuiltThis:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    whatWeveBuilt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    individualsInvolved: [],
    timeline: [
      {
        id: "3-1",
        title: "Project Launch",
        description: "Project officially launched with initial team and requirements.",
        date: "January 1, 2024",
        isStepActive: false,
      },
      {
        id: "3-2",
        title: "Development Completion",
        description: "All planned features developed and integrated. Ready for testing.",
        date: "January 30, 2024",
        isStepActive: false,
      },
      {
        id: "3-3",
        title: "User Acceptance Testing",
        description: "UAT completed successfully. All stakeholders approved the system.",
        date: "February 20, 2024",
        isStepActive: true,
      },
      {
        id: "3-4",
        title: "Full Deployment",
        description: "Complete system deployment across all regions. All features operational.",
        date: "March 1, 2024",
        isStepActive: false,
      },
      {
        id: "3-5",
        title: "Maintenance Mode",
        description: "Project transitioned to maintenance mode. Regular updates and bug fixes.",
        date: "March 25, 2024",
        isStepActive: false,
      },
    ],
  },
];
