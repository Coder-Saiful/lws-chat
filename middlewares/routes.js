const { inboxRouter } = require("../routers/inboxRouter");
const { loginRouter } = require("../routers/loginRouter");
const { trashRouter } = require("../routers/trashRouter");
const { userRouter } = require("../routers/userRouter");

module.exports.routeList = (app) => {
    app.use('/', loginRouter);
    app.use('/users', userRouter);
    app.use('/inbox', inboxRouter);
    app.use('/trash', trashRouter);
}