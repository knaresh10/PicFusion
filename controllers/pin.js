const handleCreatePin = async (req, res) => {
    if (req.fileValidationError) {
        return res.status(400).json({ error: req.fileValidationError });
    }
    if (!req.file) {
        return res.status(400).json({ error: 'Please upload a file' });
    }
    const {title, description} = req.body;
    console.log(title, description);
    return res.redirect('/');
}


module.exports = {
    handleCreatePin,
}