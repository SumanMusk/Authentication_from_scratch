let map = new Map();

function setter(key, value) {
    map.set(key, value);
}

function getter(key) {
    return map.get(key);
}

function printt() {
    console.log(map);    
}

module.exports = {
    setter,
    getter,
    printt
};