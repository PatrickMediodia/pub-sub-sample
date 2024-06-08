const checkParams = (req, res, next) => {
    if (req.params.username === undefined) {
        res.status(500).send(
            'Please enter your username in the path /publish/<username>'
        );
        return;
    }

    next();
};

export default checkParams;
