document.addEventListener('DOMContentLoaded', () => {

    // --- Header Scroll State ---
    const header = document.getElementById('header');
    const handleScrollHeader = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScrollHeader);
    handleScrollHeader(); // Trigger initially


    // --- Mobile Hamburger Menu Drawer ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    const toggleMobileNav = () => {
        hamburgerBtn.classList.toggle('active');
        mobileNav.classList.toggle('active');
        
        // Prevent body scrolling when menu is open
        if (mobileNav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };

    hamburgerBtn.addEventListener('click', toggleMobileNav);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Close drawer when a link is clicked
            hamburgerBtn.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });


    // --- Active GNB Highlight on Scroll ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.gnb-menu a');

    const highlightActiveNav = () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120; // Offset for sticky GNB

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', highlightActiveNav);


    // --- Intersection Observer for Scroll Reveals ---
    const revealElements = document.querySelectorAll('.scroll-reveal, .card-reveal');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optional: Unobserve after revealing to prevent repeating animations
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null, // viewport
        threshold: 0.15, // trigger when 15% of the element is visible
        rootMargin: '0px 0px -50px 0px' // adjust triggers slightly
    });

    revealElements.forEach(el => revealObserver.observe(el));


    // --- Parallax Zoom-in for Legendary Section ---
    const legendarySection = document.getElementById('legendary');
    const parallaxImg = document.getElementById('parallax-img');

    window.addEventListener('scroll', () => {
        if (!legendarySection || !parallaxImg) return;

        const rect = legendarySection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Check if the section is in the viewport
        if (rect.top <= viewportHeight && rect.bottom >= 0) {
            // Calculate scroll progress percentage through the section
            const totalScrollableDistance = rect.height + viewportHeight;
            const scrolledDistance = viewportHeight - rect.top;
            const progress = Math.min(Math.max(scrolledDistance / totalScrollableDistance, 0), 1);

            // Zoom effect mapping scroll progress to scale: 1.0 -> 1.25
            const minScale = 1.0;
            const maxScale = 1.28;
            const currentScale = minScale + (progress * (maxScale - minScale));
            
            // Subtle y-translation for layered parallax feel
            const translateY = (progress - 0.5) * -40; // -20px to +20px

            parallaxImg.style.transform = `scale(${currentScale}) translateY(${translateY}px)`;
        }
    });


    // --- Pre-Registration Form Validation & Submission ---
    const form = document.getElementById('pre-register-form');
    const reserveCard = document.querySelector('.reserve-card');
    
    // Form Inputs
    const inputName = document.getElementById('trainer-name');
    const inputPhone = document.getElementById('trainer-phone');
    const inputAgree = document.getElementById('agree-terms');

    // Error Message Elements
    const errorName = document.getElementById('name-error');
    const errorPhone = document.getElementById('phone-error');
    const errorAgree = document.getElementById('agree-error');

    // Phone format auto-formatter: e.g. 01012345678 -> 010-1234-5678
    inputPhone.addEventListener('input', (e) => {
        let val = e.target.value.replace(/[^0-9]/g, '');
        if (val.length > 3 && val.length <= 7) {
            val = val.substring(0, 3) + '-' + val.substring(3);
        } else if (val.length > 7) {
            val = val.substring(0, 3) + '-' + val.substring(3, 7) + '-' + val.substring(7, 11);
        }
        e.target.value = val;
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;

        // Reset errors
        errorName.style.display = 'none';
        errorPhone.style.display = 'none';
        errorAgree.style.display = 'none';
        inputName.classList.remove('invalid');
        inputPhone.classList.remove('invalid');

        // Name check
        if (!inputName.value.trim()) {
            errorName.style.display = 'block';
            inputName.classList.add('invalid');
            isValid = false;
        }

        // Phone check: 010-xxxx-xxxx format
        const phoneRegex = /^010-[0-9]{4}-[0-9]{4}$/;
        if (!phoneRegex.test(inputPhone.value)) {
            errorPhone.style.display = 'block';
            inputPhone.classList.add('invalid');
            isValid = false;
        }

        // Agree check
        if (!inputAgree.checked) {
            errorAgree.style.display = 'block';
            isValid = false;
        }

        if (isValid) {
            // High-end user experience success screen transition
            const trainerNameValue = inputName.value.trim();
            
            reserveCard.style.opacity = '0';
            reserveCard.style.transform = 'translateY(15px)';
            
            setTimeout(() => {
                reserveCard.innerHTML = `
                    <div class="success-state">
                        <svg viewBox="0 0 100 100" width="80" height="80" style="margin-bottom: 20px;">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#00e676" stroke-width="4"/>
                            <path d="M 30 52 L 44 66 L 70 36" fill="none" stroke="#00e676" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <h3>예약이 완료되었습니다!</h3>
                        <p style="margin-bottom: 25px; line-height: 1.6;">
                            <strong>${trainerNameValue}</strong> 트레이너님,<br>
                            새로운 모험의 시작을 함께해주셔서 대단히 감사합니다.<br>
                            출시 당일 입력하신 번호(<strong>${inputPhone.value}</strong>)로 한정판 보상 마스터 코드가 발송됩니다.
                        </p>
                        <button class="btn btn-secondary" onclick="window.location.reload();" style="padding: 12px 30px; font-size: 0.85rem;">처음으로 돌아가기</button>
                    </div>
                `;
                reserveCard.style.opacity = '1';
                reserveCard.style.transform = 'translateY(0)';
            }, 400);
        }
    });
});
