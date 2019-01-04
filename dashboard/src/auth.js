class Auth {
    constructor() {
        // Retrieve user and token from local storage
        let userData = window.localStorage.getItem('user');
        this.user = userData ? JSON.parse(userData) : null;
        this.token = window.localStorage.getItem('token');

        // Check for token, validate it and refresh the user instance
        if (this.token) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.token;
            this.getUser();
        }
    }

    /**
      * Log user in with the specified token
      */
    login (token, user) {
        // Store the token and user data in local storage
        window.localStorage.setItem('token', token);
        window.localStorage.setItem('user', JSON.stringify(user));

        // Make token and user available to app
        this.token = token;
        this.user = user;

        // Pass token with all axios requests
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

        // Bubble the log in event
        Event.$emit('userLoggedIn');
    }

    /**
     * Log user out, removing token from user storage and sending the message to the app
     */
    logout () {
        // Remove from local storage
        window.localStorage.setItem('token', '');
        window.localStorage.setItem('user', '');

        // Remove from the instance
        this.token = null;
        this.user = null;

        // Bubble the log out event
        Event.$emit('userLoggedOut');
    }

    /**
     * Check to see if token exists, indicating logged in user
     * @returns {boolean}
     */
    check () {
        console.log('check');
        return !! this.token;
    }

    /**
     * Retrieve the logged in user
     */
    getUser() {
        axios.get('get-user')
            .then(({data}) => {
                this.user = data;
            })
            .catch(({response}) => {
                // If user is not authenticated, log them out of app
                if (response.status === 401) {
                    this.logout();
                }
            });
    }

    role() {
        // Define role names
        let roles = {
            0: 'guest',
            1: 'admin',
            2: 'super'
        }

        // If user exists return their role
        if (this.user) {
            return roles[this.user.role_id];
        }

        // No user so return as guest
        return roles[0];
    }
}

export default Auth;