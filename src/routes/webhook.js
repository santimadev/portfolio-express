const router = require('express').Router();
const childProcess = require('child_process');
const githubUser = process.env.GITHUB_USER;

router.post("/webhooks/github", function (req, res) {
        
    const sender = req.body.sender;
    const branch = req.body.ref;

    if (branch.indexOf('master') > -1 && sender.login === githubUser) {
            deploy(res);
    } else {
            res.sendStatus(500);
    }

})

function deploy(res){
childProcess.exec('cd /home/santiago/ && ./deploy.sh', function(err, stdout, stderr){
    if (err) {
     console.error(err);
     return res.sendStatus(500);
    }
    console.log(stdout);
    res.sendStatus(200);
  });
}

module.exports = router;

