function showCategory(category) {
    console.log(`Attempting to show category: ${category}`);
    const categories = document.querySelectorAll('.menu-category');
    if (!categories.length) {
        console.error('No elements with class .menu-category found');
        return;
    }

    categories.forEach(el => {
        el.style.display = 'none';
        console.log(`Hiding category: ${el.id}`);
    });

    const selectedCategory = document.getElementById(category);
    if (selectedCategory) {
        selectedCategory.style.display = 'block';
        console.log(`Showing category: ${category}`);
        const rows = selectedCategory.querySelectorAll('.menu-table tbody tr');
        rows.forEach(row => {
            row.style.display = '';
        });
    } else {
        console.error(`Category with id "${category}" not found`);
    }

    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.value = '';
    }

    const noResults = document.getElementById('no-results');
    if (noResults) {
        noResults.classList.remove('show');
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded, initializing scripts...");
    const bar = document.querySelector('.fa-bars');
    const close = document.querySelector('.fa-xmark');
    const headerbar = document.querySelector('.headerbar');

    if (bar && headerbar && close) {
        bar.addEventListener('click', () => {
            headerbar.classList.add('active');
            bar.style.display = 'none';
            close.style.display = 'block';
        });

        close.addEventListener('click', () => {
            headerbar.classList.remove('active');
            close.style.display = 'none';
            bar.style.display = 'block';
        });
    }

    const foodItems = document.querySelectorAll('.food_items .items');
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');

    let currentSlide = 0;

    const showSlide = (index) => {
        foodItems.forEach((item, i) => {
            item.classList.remove('active');
            if (i === index) {
                item.classList.add('active');
            }
        });
    };

    if (foodItems.length > 0) {
        showSlide(currentSlide);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % foodItems.length;
            showSlide(currentSlide);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + foodItems.length) % foodItems.length;
            showSlide(currentSlide);
        });
    }

    function filterMenu(searchText) {
        const categories = ['ramen', 'seafood', 'drinks'];
        let hasVisibleRows = false;

        categories.forEach(category => {
            const categoryElement = document.getElementById(category);
            const tbody = document.querySelector(`#${category} .menu-table tbody`);
            if (!tbody || !categoryElement) return;

            if (categoryElement.style.display !== 'none') {
                const rows = Array.from(tbody.querySelectorAll('tr'));
                rows.forEach(row => {
                    const dishName = row.querySelector('td:first-child').textContent.toLowerCase();
                    const isVisible = dishName.includes(searchText.toLowerCase());
                    row.style.display = isVisible ? '' : 'none';
                    if (isVisible) hasVisibleRows = true;
                });
            }
        });

        const noResults = document.getElementById('no-results');
        if (noResults) {
            noResults.classList.toggle('show', !hasVisibleRows);
        }
    }

    function sortMenu(category, sortType) {
        const tbody = document.querySelector(`#${category} .menu-table tbody`);
        if (!tbody) return;

        const rows = Array.from(tbody.querySelectorAll('tr'));

        rows.sort((rowA, rowB) => {
            if (sortType === 'price-asc') {
                const priceA = parseFloat(rowA.querySelectorAll('td')[2].textContent.replace('$', ''));
                const priceB = parseFloat(rowB.querySelectorAll('td')[2].textContent.replace('$', ''));
                return priceA - priceB;
            } else if (sortType === 'price-desc') {
                const priceA = parseFloat(rowA.querySelectorAll('td')[2].textContent.replace('$', ''));
                const priceB = parseFloat(rowB.querySelectorAll('td')[2].textContent.replace('$', ''));
                return priceB - priceA;
            } else if (sortType === 'popularity') {
                const popularityA = parseInt(rowA.dataset.popularity || 0);
                const popularityB = parseInt(rowB.dataset.popularity || 0);
                return popularityB - popularityA;
            }
            return 0;
        });

        rows.forEach(row => tbody.appendChild(row));
    }

    const menuData = {
        ramen: [
            {
                name: "Ramen Classic",
                image: "images/items3-removebg-preview (1).png",
                price: "$12.99",
                ingredients: ["noodles", "broth", "pork", "egg"],
                popularity: 100
            },
            {
                name: "Spicy Ramen",
                image: "images/items3-removebg-preview (1).png",
                price: "$13.99",
                ingredients: ["noodles", "spicy broth", "chili oil", "beef"],
                popularity: 80
            },
        ],
        seafood: [
            {
                name: "Sushi Set",
                image: "images/items2-removebg-preview.png",
                price: "$18.50",
                ingredients: ["rice", "salmon", "tuna", "nori", "wasabi"],
                popularity: 120
            },
            {
                name: "Sushi Set",
                image: "images/items2-removebg-preview.png",
                price: "$18.50",
                ingredients: ["rice", "salmon", "tuna", "nori", "wasabi"],
                popularity: 90
            }
        ],
        drinks: [
            {
                name: "Green Tea",
                image: "images/green-tea.png",
                price: "$3.00",
                ingredients: ["green tea leaves", "water", "honey (optional)"],
                popularity: 50
            },
            {
                name: "Green Tea",
                image: "images/green-tea.png",
                price: "$3.00",
                ingredients: ["green tea leaves", "water", "honey (optional)"],
                popularity: 40
            }
        ]
    };

    for (let category in menuData) {
        const tbody = document.querySelector(`#${category} .menu-table tbody`);
        if (!tbody) continue;
        tbody.innerHTML = "";

        menuData[category].forEach((dish, index) => {
            const tr = document.createElement("tr");
            tr.dataset.popularity = dish.popularity;

            const nameTd = document.createElement("td");
            nameTd.textContent = dish.name;

            const imageTd = document.createElement("td");
            const img = document.createElement("img");
            img.src = dish.image;
            img.alt = dish.name;
            img.className = "dish-img";
            imageTd.appendChild(img);

            const priceTd = document.createElement("td");
            priceTd.textContent = dish.price;

            const buttonTd = document.createElement("td");
            const btn = document.createElement("button");
            btn.className = "ingredients-btn";
            btn.textContent = "Ingredients";

            const ingrBlock = document.createElement("div");
            ingrBlock.className = "ingredient-popup";
            ingrBlock.id = `ingr-${category}-${index}`;
            ingrBlock.style.display = "none";

            dish.ingredients.forEach(ingr => {
                const badge = document.createElement("span");
                badge.className = "ingredient-badge";
                badge.textContent = ingr;
                ingrBlock.appendChild(badge);
            });

            btn.onclick = () => {
                ingrBlock.style.display = "block";
                setTimeout(() => {
                    ingrBlock.classList.add("fade-out");
                    setTimeout(() => {
                        ingrBlock.style.display = "none";
                        ingrBlock.classList.remove("fade-out");
                    }, 500);
                }, 1500);
            };

            buttonTd.appendChild(btn);
            buttonTd.appendChild(ingrBlock);

            tr.appendChild(nameTd);
            tr.appendChild(imageTd);
            tr.appendChild(priceTd);
            tr.appendChild(buttonTd);

            tbody.appendChild(tr);
        });
    }

    if (document.querySelector('.menu-category')) {
        console.log("Initializing default category: ramen");
        showCategory('ramen');
    }

    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const searchText = this.value.trim();
            filterMenu(searchText);
        });
    }

    const sortSelect = document.getElementById('sortMenu');
    if (sortSelect) {
        sortSelect.addEventListener('change', function () {
            const sortType = this.value;
            for (let category in menuData) {
                sortMenu(category, sortType);
            }
        });
        for (let category in menuData) {
            sortMenu(category, 'price-asc');
        }
        sortSelect.value = 'price-asc';
    }

    const form = document.getElementById("commentForm");
    const list = document.getElementById("commentList");

    if (form && list) {
        const loadComments = () => {
            const savedComments = JSON.parse(localStorage.getItem('comments') || '[]');
            list.innerHTML = '';
            savedComments.forEach(({ name, comment }) => {
                const li = document.createElement("li");
                li.innerHTML = `<strong>${name}</strong><br>${comment}`;
                list.prepend(li);
            });
        };
        const saveComment = (name, comment) => {
            const savedComments = JSON.parse(localStorage.getItem('comments') || '[]');
            savedComments.unshift({ name, comment });
            localStorage.setItem('comments', JSON.stringify(savedComments));
        };

        
        loadComments();

        form.addEventListener("submit", function (e) {
            e.preventDefault();
            const name = document.getElementById("username").value.trim();
            const comment = document.getElementById("commentText").value.trim();

            if (name && comment) {
                const li = document.createElement("li");
                li.innerHTML = `<strong>${name}</strong><br>${comment}`;
                list.prepend(li);

                saveComment(name, comment);

                form.reset();

                const feedbackBox = document.querySelector('.comments-section h3');
                feedbackBox.classList.add('feedback-sent');

                setTimeout(() => {
                    feedbackBox.classList.remove('feedback-sent');
                    feedbackBox.style.display = 'block';
                }, 1000);
            }
        });
    }
});