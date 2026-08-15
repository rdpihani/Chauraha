const OWNER_WHATSAPP = "+919999999999"; 

let selectedService = "";
let backPressedOnce = false;

// सोशल मीडिया और वेबसाइट लिंक्स को मोबाइल में खोलने के लिए फ़ंक्शन
function openSocialLink(url) {
    if (window.cordova || window.Android) {
        window.open(url, '_system', 'location=yes');
    } else {
        window.open(url, '_blank', 'noopener,noreferrer');
    }
}

function switchTab(screenId, element) {
    const screens = document.querySelectorAll('.view-screen');
    screens.forEach(screen => screen.classList.remove('active'));

    document.getElementById(screenId).classList.add('active');

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    element.classList.add('active');

    window.scrollTo(0, 0);
}

function filterServices() {
    const input = document.getElementById('service-search').value.toLowerCase();
    const cards = document.querySelectorAll('.service-card');

    cards.forEach(card => {
        const name = card.getAttribute('data-name');
        if (name.includes(input)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

function openBookingModal(serviceName) {
    selectedService = serviceName;
    document.getElementById('modal-service-title').innerText = serviceName + " बुक करें";
    document.getElementById('booking-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('booking-modal').style.display = 'none';
}

function handleFormSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('cust-name').value;
    const phone = document.getElementById('cust-phone').value;
    const address = document.getElementById('cust-address').value;
    const work = document.getElementById('cust-work').value || "कोई विवरण नहीं";

    const message = `*नई सेवा बुकिंग (चौराहा सर्विस App)*%0A%0A` +
                    `*सेवा:* ${selectedService}%0A` +
                    `*नाम:* ${name}%0A` +
                    `*मोबाइल:* ${phone}%0A` +
                    `*पता:* ${address}%0A` +
                    `*काम:* ${work}`;

    const whatsappUrl = `https://wa.me/${OWNER_WHATSAPP}?text=${message}`;
    openSocialLink(whatsappUrl);

    saveBookingLocally(selectedService, name);
    closeModal();
    document.getElementById('booking-form').reset();
}

function openWhatsAppDirect() {
    const message = `नमस्कार चौराहा सर्विस! मुझे एक सेवा के बारे में जानकारी चाहिए।`;
    openSocialLink(`https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(message)}`);
}

function shareApp() {
    if (navigator.share) {
        navigator.share({
            title: 'चौराहा सर्विस',
            text: 'चौराहे की हर सुविधा, सिर्फ एक क्लिक पर - चौराहा सर्विस ऐप',
            url: 'https://chaurahaservice.com'
        }).catch(() => {});
    } else {
        const shareText = `चौराहे की हर सुविधा, सिर्फ एक क्लिक पर\nएप/साइट: https://chaurahaservice.com`;
        openSocialLink(`https://wa.me/?text=${encodeURIComponent(shareText)}`);
    }
}

function saveBookingLocally(service, name) {
    const bookingList = document.getElementById('booking-list');
    
    if (bookingList.querySelector('.empty-state')) {
        bookingList.innerHTML = '';
    }

    const card = document.createElement('div');
    card.className = 'location-card';
    card.style.background = '#ffffff';
    card.style.borderLeft = '4px solid #0288d1';
    card.style.marginBottom = '10px';

    const date = new Date().toLocaleDateString('hi-IN');

    card.innerHTML = `
        <div>
            <strong style="color: #0288d1;">${service}</strong><br>
            <small>दिनांक: ${date} | नाम: ${name}</small>
        </div>
        <span style="background: #e1f5fe; color: #0288d1; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem;">सफल</span>
    `;

    bookingList.prepend(card);
}

window.addEventListener('load', function() {
    window.history.pushState({ page: 1 }, "", "");
});

window.addEventListener('popstate', function(event) {
    if (backPressedOnce) {
        return;
    }

    backPressedOnce = true;
    window.history.pushState({ page: 1 }, "", "");
    
    const toast = document.getElementById("toast");
    toast.className = "toast show";
    
    setTimeout(function() {
        toast.className = toast.className.replace("show", "");
        backPressedOnce = false;
    }, 2000);
});
