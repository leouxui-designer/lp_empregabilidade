var e=`(function (f) { document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', f) : f() })(() => {
    const pluginUrl = window.faqPlugin.baseUrl;

    const searchInput = document.getElementById('faqSearch');
    const icon = document.getElementById('faqSearchIcon');
    const items = document.querySelectorAll('.faq-item');
    const emptyMsg = document.querySelector('.faq-empty');

  
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        let visibleCount = 0;

        icon.src = searchInput.value.length > 0
            ? pluginUrl + "assets/icons/close.svg"
            : pluginUrl + "assets/icons/search.svg";

        icon.style.cursor = searchInput.value.length > 0 ? 'pointer' : 'default';

        items.forEach(item => {
            const question = item.querySelector('.faq-question').textContent.toLowerCase();
            if (question.includes(query)) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        emptyMsg.style.display = visibleCount === 0 ? 'flex' : 'none';
    });

    icon.addEventListener('click', () => {
        if (searchInput.value.length > 0) {
            searchInput.value = '';
            icon.src = pluginUrl + "assets/icons/search.svg";
            icon.style.cursor = 'default';
            searchInput.dispatchEvent(new Event('input'));
        }
    });

    items.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('open'));

            if (!isOpen) {
                item.classList.add('open');
            }
        });

        const answer = item.querySelector('.faq-answer');
        answer.addEventListener('click', (e) => {
            if (e.target.closest('a')) {
                e.stopPropagation();
            }
        });
    });
});
`;export{e as default};