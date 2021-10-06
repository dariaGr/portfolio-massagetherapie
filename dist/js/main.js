$(function () {
	// Adaptive menu
	$('.header__burger').click(function (event) {
		$('.header__burger, .header__menu').toggleClass('menu-active');
		$('body').toggleClass('lock');
	});
	$('.header__menu-link').click(function (event) {
		$('.header__burger, .header__menu').removeClass('menu-active');
		$('body').removeClass('lock');
	});

	// Using the slick-slider
	$('.review__slider').slick({
		dots: true,
		slidesToShow: 1,
		adaptiveHeight: true,
		centerMode: true,
		variableWidth: true,
		speed: 700,
		responsive: [
			{
				breakpoint: 500,
				settings: {
					arrows: false,
					// dots: false,
				},
			},
		],
	});
	$('.gallery__slider').slick({
		slidesToShow: 1,
		adaptiveHeight: true,
		centerMode: true,
		variableWidth: true,
		speed: 700,
		autoplay: true,
		autoplaySpeed: 2000,
		responsive: [
			{
				breakpoint: 426,
				settings: {
					autoplay: false,
					arrows: false,
				},
			},
		],
	});

	// Scrolling to the top of the page when clicking the arrow on the right-hand bottom corner of the page
	$(window).scroll(function () {
		var height = $(window).scrollTop();
		if (height > 100) {
			$('#back2Top').fadeIn();
		} else {
			$('#back2Top').fadeOut();
		}
	});
	$(document).ready(function () {
		$('#back2Top').click(function (event) {
			event.preventDefault();
			$('html, body').animate({ scrollTop: 0 }, 'slow');
			return false;
		});
	});

	// Animation after loading the page and scrolling
	const animItems = document.querySelectorAll('._anim-items');
	if (animItems.length > 0) {
		window.addEventListener('scroll', animOnScroll);
		function animOnScroll() {
			for (let index = 0; index < animItems.length; index++) {
				const animItem = animItems[index];
				const animItemHeight = animItem.offsetHeight;
				const animItemOffset = offset(animItem).top;
				const animStart = 4;

				let animItemPoint = window.innerHeight - animItemHeight / animStart;
				if (animItemHeight > window.innerHeight) {
					animItemPoint = window.innerHeight - window.innerHeight / animStart;
				}

				if (
					pageYOffset > animItemOffset - animItemPoint &&
					pageYOffset < animItemOffset + animItemHeight
				) {
					animItem.classList.add('_active');
				} else {
					if (!animItem.classList.contains('_anim-no-hide')) {
						animItem.classList.remove('_active');
					}
				}
			}
		}
		function offset(el) {
			const rect = el.getBoundingClientRect(),
				scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
				scrollTop = window.pageYOffset || document.documentElement.scrollTop;
			return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
		}

		setTimeout(() => {
			animOnScroll();
		}, 300);
	}
});

// Validating and sending a form
document.addEventListener('DOMContentLoaded', function () {
	const form = document.getElementById('form');
	const popupForm = document.getElementById('popup-form');

	form.addEventListener('submit', formSend);
	popupForm.addEventListener('submit', popupFormSend);

	async function formSend(e) {
		e.preventDefault();

		let error = formValidate(form);

		let formData = new FormData(form);

		if (error === 0) {
			form.classList.add('_sending');
			let response = await fetch('sendmail.php', {
				method: 'POST',
				body: formData,
			});
			if (response.ok) {
				let result = await response.json();
				alert(result.message);
				// formPreview.innerHTML = '';
				form.reset();
				form.classList.remove('_sending');
			} else {
				alert('Fehler!');
				form.classList.remove('_sending');
			}
		} else {
			alert('Füllen Sie die erforderlichen Felder aus!');
		}
	}

	async function popupFormSend(e) {
		e.preventDefault();

		let popupFormData = new FormData(popupForm);

		popupForm.classList.add('_sending');
		let response = await fetch('sendmail.php', {
			method: 'POST',
			body: popupFormData,
		});
		if (response.ok) {
			let result = await response.json();
			alert(result.message);
			// formPreview.innerHTML = '';
			form.reset();
			form.classList.remove('_sending');
		} else {
			alert('Fehler!');
			form.classList.remove('_sending');
		}
	}

	function formValidate(form) {
		let error = 0;
		let formReq = document.querySelectorAll('._req');

		for (let index = 0; index < formReq.length; index++) {
			const input = formReq[index];
			formRemoveError(input);

			if (input.classList.contains('_email')) {
				if (emailTest(input)) {
					formAddError(input);
					error++;
				}
			} else {
				if (input.value === '') {
					formAddError(input);
					error++;
				}
			}
		}
		return error;
	}

	function formAddError(input) {
		input.parentElement.classList.add('_error');
		input.classList.add('_error');
	}
	function formRemoveError(input) {
		input.parentElement.classList.remove('_error');
		input.classList.remove('_error');
	}

	function emailTest(input) {
		return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
	}
});
