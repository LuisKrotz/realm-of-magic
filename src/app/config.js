module.exports = global.config = {
    tokens: {
        authToken: 'Auth Token'
    },
    routes: {
        create: "/create",
        login: "/login",
        list: "/"
    },
    api: {
        path: "https://9488e748.us-south.apigw.appdomain.cloud/api/v1",
        spells: "/spells",
        findByID: "/spells/findById"
    }
}