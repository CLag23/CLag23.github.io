document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('main form');
    if (!form) return;

    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const remember = form.querySelector('input[type="checkbox"][name="remember"]');

    try {
        const rememberedEmail = localStorage.getItem('pp_remember_email');
        if (rememberedEmail && email) email.value = rememberedEmail;
    } catch (err) {
        // something
    }

    const clearCustomValidity = () => {
        if (email) email.setCustomValidity('');
        if (password) password.setCustomValidity('');
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearCustomValidity();

        let ok = true;

        if (email) {
            if (!email.value.trim()) {
                email.setCustomValidity('Please enter your email.');
                ok = false;
            } else if (!email.checkValidity()) {
                email.setCustomValidity('Please enter a valid email address.');
                ok = false;
            }
        }

        if (password) {
            if (!password.value.trim()) {
                password.setCustomValidity('Please enter your password.');
                ok = false;
            } else if (password.value.length < 6) {
                password.setCustomValidity('Password must be at least 6 characters.');
                ok = false;
            }
        }

        if (!ok) {
            form.reportValidity();
            return;
        }

        try {
            const wantsRemember = !!(remember && remember.checked);
            if (wantsRemember && email) {
                localStorage.setItem('pp_remember_email', email.value.trim());
            } else {
                localStorage.removeItem('pp_remember_email');
            }
        } catch (err) {
            // ignore storage errors
        }

        window.location.href = 'index.html';
    });
});
