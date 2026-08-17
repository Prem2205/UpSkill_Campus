const API =
    "http://localhost:5000/api";


// Load services
async function loadServices(category = "") {

    try {

        let url =
            API + "/services";


        if (category) {

            const merchantsResponse =
                await fetch(
                    API +
                    "/merchants?category=" +
                    encodeURIComponent(
                        category
                    )
                );


            const merchants =
                await merchantsResponse.json();


            if (
                merchants.length === 0
            ) {

                displayServices([]);

                return;

            }


            const servicesResponse =
                await fetch(
                    API +
                    "/services"
                );


            const services =
                await servicesResponse.json();


            const filtered =
                services.filter(
                    service =>
                        merchants.some(
                            merchant =>
                                merchant._id ===
                                service.merchant?._id
                        )
                );


            displayServices(
                filtered
            );


            return;

        }


        const response =
            await fetch(url);


        const services =
            await response.json();


        displayServices(
            services
        );


    } catch (error) {

        console.error(error);

    }

}


// Display services
function displayServices(
    services
) {

    const container =
        document.getElementById(
            "services"
        );


    if (!container) {

        return;

    }


    if (
        !services ||
        services.length === 0
    ) {

        container.innerHTML =
            "<p>No services found.</p>";

        return;

    }


    container.innerHTML =
        services.map(
            service => `

                <div class="service-card">

                    <img
                        src="${
                            service.image ||
                            "https://via.placeholder.com/400x200"
                        }"
                        alt="${service.name}"
                    >

                    <h3>
                        ${service.name}
                    </h3>

                    <p>
                        ${
                            service.description ||
                            "Professional service"
                        }
                    </p>

                    <p>
                        Merchant:
                        ${
                            service.merchant
                            ?.businessName ||
                            "Merchant"
                        }
                    </p>

                    <p class="price">
                        ₹${service.price}
                    </p>

                    <button
                        onclick='addToCart(${JSON.stringify(service)})'
                    >
                        Add to Cart
                    </button>

                </div>

            `
        ).join("");

}


// Add service to cart
function addToCart(service) {

    let cart =
        JSON.parse(
            localStorage.getItem(
                "cart"
            )
        ) || [];


    cart.push(service);


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    alert(
        service.name +
        " added to cart!"
    );

}


// Search
const search =
    document.getElementById(
        "search"
    );


if (search) {

    search.addEventListener(
        "keyup",
        async function() {

            const value =
                search.value.trim();


            if (!value) {

                loadServices();

                return;

            }


            const response =
                await fetch(
                    API +
                    "/services?search=" +
                    encodeURIComponent(
                        value
                    )
                );


            const services =
                await response.json();


            displayServices(
                services
            );

        }
    );

}


// Load initial services
if (
    document.getElementById(
        "services"
    )
) {

    loadServices();

}