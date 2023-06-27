export const options = {
  openapi: "Enable",
  language: "en-US",
  disableLogs: false,
  autoHeaders: true,
  autoQuery: true,
  autoBody: true
};

export const doc = {
  info: {
    title: "Innovative",
    description: "Description"
  },
  host: "localhost:3000",
  schemes: ["http"]
};

export const outputFile = "src/swagger_output.json";
export const endpointsFiles = [
  "./routes/users",
  "./routes/tokens",
  "./routes/movies",
  "./routes/ratings",
  "./routes/comments"
];
