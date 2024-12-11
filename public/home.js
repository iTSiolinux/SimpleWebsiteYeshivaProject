// home.js
function parseCookies() {
    const cookies = document.cookie.split('; ');
    const cookieObject = {};

    cookies.forEach(cookie => {
        const [key, value] = cookie.split('=');
        cookieObject[decodeURIComponent(key)] = decodeURIComponent(value);
    });

    return cookieObject;
}

const cookies = parseCookies();

document.querySelector('h1').innerText += "\n" + cookies.sessionId;