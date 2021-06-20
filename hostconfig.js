const defaultHostname = '127.0.0.1';
const defaultPort = 8080;

// Retrieves a usable hostname from the command line args.
// If a proper hostname was not entered in the command line, the default hostname is used.
exports.setServerHostname = function(userArgs) {
    var issueWithHostnameFound = false;
    if(userArgs.length >= 1) {
        // Potential host name would need to have 4 elements after the call to split for it to be a valid IP address.
        var potentialHostname = userArgs[0].split('.');
        
        if(potentialHostname.length == 4) {
            for(var i = 0; i < potentialHostname.length; i++) {
                // isNaN considers empty strings to be numbers, which made hostnames such as "127..."
                // register as valid. The second clause was added to this if to check that the number entered
                // by the user has characters in it.
                if(!isNaN(potentialHostname[i]) && !(potentialHostname[i].length === 0)) {
                    var ipBlock = parseInt(potentialHostname[i]);
                    if(ipBlock < 0 || ipBlock > 255) {
                        issueWithHostnameFound = true;
                    }
                }
                else {
                    issueWithHostnameFound = true;
                }
            }
        }
        else {
            issueWithHostnameFound = true;
        }
    }
    if(issueWithHostnameFound) {
        console.log(`Problem found with supplied hostname.\nUsing the default hostname of ${defaultHostname}\n`);
    }
    return (userArgs.length >= 1 && !issueWithHostnameFound ? userArgs[0] : defaultHostname);
}

// Retrieves a usable port from the command line args.
// If a proper port was not entered in the command line, the default port is used.
exports.setServerPort = function(userArgs) {
    var currentPort = defaultPort;

    if(userArgs.length >= 2 && !isNaN(userArgs[1])) {
        var potentialPort = parseInt(userArgs[1]);
        // The potentialPort is only used if its inside the acceptable range of port values (0 - 65535).
        if(potentialPort >= 0 && potentialPort <= 65535) {
            currentPort = potentialPort;
        }
        else {
            console.log(`Problem found with supplied port.\nUsing the default port of ${defaultPort}\n`);
        }
    }
    else if(userArgs.length >= 2 && isNaN(userArgs[1])) {
        console.log(`Problem found with supplied port.\nUsing the default port of ${defaultPort}\n`);
    }
    return currentPort;
}