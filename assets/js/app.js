/* ==========================================================
   app.js - shared JavaScript for all five pages
   Requires jQuery (loaded before this file in every page)
   ========================================================== */

$(document).ready(function () {

    /* ---------- 1. LIVE DATE & TIME ---------- */
    function updateDateTime() {
        var now = new Date();
        var options = {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        $('#liveDateTime').text(now.toLocaleString('en-US', options));
    }
    updateDateTime();
    setInterval(updateDateTime, 1000);


    /* ---------- 2. FOOTER YEAR ---------- */
    $('#currentYear').text(new Date().getFullYear());


    /* ---------- 3. PROFILE IMAGE FALLBACK ----------
       If assets/images/profile.jpg is missing, show a simple
       placeholder picture instead of a broken image icon.
       Once you add your own profile.jpg, it is used automatically. */
    var PLACEHOLDER_SVG = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750">' +
        '<rect width="600" height="750" fill="#e0e7ff"/>' +
        '<circle cx="300" cy="280" r="110" fill="#a5b4fc"/>' +
        '<path d="M110 640c0-120 85-200 190-200s190 80 190 200z" fill="#a5b4fc"/>' +
        '<text x="300" y="705" text-anchor="middle" font-family="Arial" font-size="26" fill="#312e81">Add assets/images/profile.jpg</text>' +
        '</svg>'
    );

    function usePlaceholder(img) {
        if (img.getAttribute('data-fallback') === 'done') {
            return;
        }
        img.setAttribute('data-fallback', 'done');
        img.src = PLACEHOLDER_SVG;
    }

    $('.js-profile-img').each(function () {
        var img = this;
        // image may have already failed before this script ran
        if (img.complete && img.naturalWidth === 0) {
            usePlaceholder(img);
        }
        $(img).on('error', function () {
            usePlaceholder(img);
        });
    });


    /* ---------- 4. CONTACT FORM VALIDATION (front-end only) ---------- */
    var $form = $('#contactForm');

    if ($form.length) {

        function showError($field, message) {
            $field.removeClass('is-valid').addClass('is-invalid');
            $field.siblings('.invalid-feedback').text(message);
        }

        function showValid($field) {
            $field.removeClass('is-invalid').addClass('is-valid');
            $field.siblings('.invalid-feedback').text('');
        }

        // returns true if the field is valid, false if not
        function validateField($field) {
            var id = $field.attr('id');
            var value = $.trim($field.val());

            if (id === 'name') {
                if (value === '') {
                    showError($field, 'Please enter your full name.');
                    return false;
                }
                if (value.length < 2) {
                    showError($field, 'Name must be at least 2 characters.');
                    return false;
                }
            }

            if (id === 'email') {
                var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
                if (value === '') {
                    showError($field, 'Please enter your email address.');
                    return false;
                }
                if (!emailPattern.test(value)) {
                    showError($field, 'Please enter a valid email, for example name@example.com.');
                    return false;
                }
            }

            if (id === 'phone') {
                var phonePattern = /^\+?[0-9\s\-()]+$/;
                var digits = value.replace(/\D/g, '');
                if (value === '') {
                    showError($field, 'Please enter your phone number.');
                    return false;
                }
                if (!phonePattern.test(value)) {
                    showError($field, 'Phone can only contain numbers, spaces, + - and ( ).');
                    return false;
                }
                if (digits.length < 7 || digits.length > 15) {
                    showError($field, 'Phone number must have between 7 and 15 digits.');
                    return false;
                }
            }

            if (id === 'address') {
                if (value === '') {
                    showError($field, 'Please enter your address.');
                    return false;
                }
                if (value.length < 5) {
                    showError($field, 'Address looks too short.');
                    return false;
                }
            }

            if (id === 'message') {
                if (value === '') {
                    showError($field, 'Please write a message.');
                    return false;
                }
                if (value.length < 10) {
                    showError($field, 'Message must be at least 10 characters.');
                    return false;
                }
                if (value.length > 1000) {
                    showError($field, 'Message must be 1000 characters or fewer.');
                    return false;
                }
            }

            showValid($field);
            return true;
        }

        // check a field when the user leaves it, and re-check while typing after a first check
        $form.find('.form-control').on('blur', function () {
            validateField($(this));
        });

        $form.find('.form-control').on('input', function () {
            if ($(this).hasClass('is-invalid') || $(this).hasClass('is-valid')) {
                validateField($(this));
            }
        });

        $form.on('submit', function (event) {
            event.preventDefault();

            var allValid = true;
            var $firstInvalid = null;

            $form.find('.form-control').each(function () {
                if (!validateField($(this))) {
                    allValid = false;
                    if ($firstInvalid === null) {
                        $firstInvalid = $(this);
                    }
                }
            });

            var $alert = $('#formAlert');

            if (!allValid) {
                $alert.removeClass('d-none alert-success').addClass('alert-danger')
                    .text('Please fix the highlighted fields and try again.');
                $firstInvalid.trigger('focus');
                return;
            }

            // All fields are valid.
            // NOTE: no data is sent anywhere. A backend or a form service
            // (Formspree, Web3Forms, EmailJS, etc.) is needed for real delivery.
            $alert.removeClass('d-none alert-danger').addClass('alert-success')
                .text('Your form passed validation. This demo has no backend, so no message was sent yet.');

            $form[0].reset();
            $form.find('.form-control').removeClass('is-valid is-invalid');
        });
    }

});