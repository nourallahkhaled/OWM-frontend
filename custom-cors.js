module.exports = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200'); 
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        res.sendStatus(200); // Respond to preflight requests
    } else {
        next();
    }
};