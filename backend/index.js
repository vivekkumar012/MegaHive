import express from "express"

const app = express();

app.use("/api/v1/user", );

const port = 3001;
app.listen(port, () => {
    console.log(`App is Listening on PORT${port}`);
})