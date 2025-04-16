require("dotenv").config({ path: __dirname + "/.env" });

const mongoose = require("mongoose");
const Library = require("./models/Library"); // ✅ Model import

const libraries = [
  {
    id: "1",
    name: "React.js",
    description: "A JavaScript library for building user interfaces",
    longDescription: "React is a declarative, efficient, and flexible JavaScript library...",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    category: "Frontend Framework",
    website: "https://reactjs.org",
    github: "https://github.com/facebook/react",
    npm: "https://www.npmjs.com/package/react",
    stars: 198000,
    version: "18.2.0",
    license: "MIT",
    lastUpdate: "2 months ago",
    firstRelease: "May 29, 2013",
    weeklyDownloads: 15700000,
    contributors: 1602,
    usedBy: ["Facebook", "Netflix", "Airbnb"],
    dependencies: ["loose-envify", "object-assign", "scheduler"],
    os: ["Windows", "macOS", "Linux"],
    bundle: {
      size: "42.2 kB",
      gzipped: "13.8 kB"
    },
    performance: {
      loadTime: 82,
      renderTime: 76,
      memoryUsage: 68
    },
    issues: {
      open: 760,
      closed: 11300
    },
    securityIssues: 0,
    testCoverage: 88,
    alternatives: ["Vue.js", "Angular", "Svelte"],
    code: `import React from 'react';\nimport ReactDOM from 'react-dom';\n\nfunction App() {\n  return <h1>Hello, React</h1>;\n}\n\nReactDOM.render(<App />, document.getElementById('root'));`,
    codeMaintainability: 95,
    typeSupport: "Excellent",
    documentation: 96,
    communitySupport: 98,
  },
  {
    id: "2",
    name: "Vue.js",
    description: "Progressive JavaScript framework for building UIs",
    longDescription: "Vue is a progressive framework for building user interfaces...",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg",
    category: "Frontend Framework",
    website: "https://vuejs.org",
    github: "https://github.com/vuejs/vue",
    npm: "https://www.npmjs.com/package/vue",
    stars: 197000,
    version: "3.2.45",
    license: "MIT",
    lastUpdate: "1 month ago",
    firstRelease: "February 2014",
    weeklyDownloads: 4900000,
    contributors: 368,
    usedBy: ["Alibaba", "GitLab"],
    dependencies: [],
    os: ["Windows", "macOS", "Linux"],
    bundle: {
      size: "33.1 kB",
      gzipped: "11.9 kB"
    },
    performance: {
      loadTime: 90,
      renderTime: 88,
      memoryUsage: 72
    },
    issues: {
      open: 580,
      closed: 9800
    },
    securityIssues: 0,
    testCoverage: 90,
    alternatives: ["React", "Svelte"],
    code: `<template><h1>Hello Vue</h1></template>`,
    codeMaintainability: 92,
    typeSupport: "Good",
    documentation: 98,
    communitySupport: 90,
  },
  {
    id: "3",
    name: "Next.js",
    description: "server-rendered React apps",
    longDescription: "Next.js is an open-source project used widely for modern software development. It offers server-rendered react apps and has strong community and documentation.",
    logo: "https://placehold.co/100x100?text=Next.j",
    category: "Frontend Framework",
    website: "https://nextjs.org",
    github: "https://github.com/vercel/nextjs",
    npm: "https://www.npmjs.com/package/nextjs",
    stars: 158978,
    version: "1.5.15",
    license: "MIT",
    lastUpdate: "8 months ago",
    firstRelease: "2021",
    weeklyDownloads: 90068,
    contributors: 395,
    usedBy: ["Meta", "Google", "Amazon", "Uber"],
    dependencies: ["core-js", "babel-runtime"],
    os: ["Windows", "macOS", "Linux"],
    bundle: {
      size: "32.9 kB",
      gzipped: "10.6 kB"
    },
    performance: {
      loadTime: 91,
      renderTime: 71,
      memoryUsage: 66
    },
    issues: {
      open: 784,
      closed: 4158
    },
    securityIssues: 0,
    testCoverage: 97,
    alternatives: ["React", "Vue", "Angular", "Svelte"],
    code: "// Hello from Next.js\nconsole.log('Welcome to Next.js');",
    codeMaintainability: 87,
    typeSupport: "Good",
    documentation: 89,
    communitySupport: 97
  },
  {
    id: "4",
    name: "Redux Toolkit",
    description: "state management in Redux",
    longDescription: "Redux Toolkit is an open-source project used widely for modern software development. It offers state management in redux and has strong community and documentation.",
    logo: "https://placehold.co/100x100?text=Redux",
    category: "State Management",
    website: "https://redux-toolkit.org",
    github: "https://github.com/reduxjs/redux-toolkit",
    npm: "https://www.npmjs.com/package/@reduxjs/toolkit",
    stars: 10420,
    version: "1.3.10",
    license: "MIT",
    lastUpdate: "10 months ago",
    firstRelease: "2020",
    weeklyDownloads: 157684,
    contributors: 330,
    usedBy: ["Meta", "Google", "Amazon", "Uber"],
    dependencies: ["core-js", "babel-runtime"],
    os: ["Windows", "macOS", "Linux"],
    bundle: {
      size: "68.8 kB",
      gzipped: "20.0 kB"
    },
    performance: {
      loadTime: 93,
      renderTime: 95,
      memoryUsage: 77
    },
    issues: {
      open: 1003,
      closed: 3313
    },
    securityIssues: 0,
    testCoverage: 99,
    alternatives: ["React", "Vue", "Angular", "Svelte"],
    code: "// Hello from Redux Toolkit\nconsole.log('Welcome to Redux Toolkit');",
    codeMaintainability: 86,
    typeSupport: "Excellent",
    documentation: 88,
    communitySupport: 92
  }
  
];

const run = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("❌ MONGO_URI is missing in your .env file");
    process.exit(1);
  }

  try {
    console.log("Seeding started...");

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Library.deleteMany({});
    await Library.insertMany(libraries);

    console.log("✅ Database seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

run();