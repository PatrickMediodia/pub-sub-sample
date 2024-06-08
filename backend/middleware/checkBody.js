const checkBody = (req, res, next) => {
    if (req.body.topic === undefined) {
        res.status(500).send(
            'Please include a topic in your request'
        );
        return;
    }

    if (req.body.message === undefined) {
        res.status(500).send(
            'Please include a message in your request'
        );
        return;
    }

    next();
}

export default checkBody;
