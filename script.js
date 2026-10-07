const predictionForm = document.getElementById("predictionForm");

predictionForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const roomType = document.getElementById("roomType").value;
    const city = document.getElementById("city").value;
    const bedrooms = Number(document.getElementById("bedrooms").value);
    const bathrooms = Number(document.getElementById("bathrooms").value);
    const beds = Number(document.getElementById("beds").value);
    const capacity = Number(document.getElementById("capacity").value);
    const actualPrice = Number(document.getElementById("actualPrice").value);

    try {
        const response = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                RoomType: roomType,
                City: city,
                Bedrooms: bedrooms,
                Bathrooms: bathrooms,
                Beds: beds,
                PersonCapacity: capacity
            })
        });

        if (!response.ok) {
            throw new Error("Prediction request failed");
        }

        const data = await response.json();

        const predictedPrice = Number(data.predicted_price);

        // Display predicted price
        document.getElementById("predictedPrice").textContent =
            "₹" + predictedPrice.toLocaleString("en-IN", {
                maximumFractionDigits: 2
            });

        // Display current price if entered
        const currentPriceElement = document.getElementById("currentPrice");
        const differenceElement = document.getElementById("priceDifference");
        const comparisonResult = document.getElementById("comparisonResult");

        if (actualPrice > 0) {
            const difference = actualPrice - predictedPrice;

            currentPriceElement.textContent =
                "₹" + actualPrice.toLocaleString("en-IN");

            differenceElement.textContent =
                "₹" + Math.abs(difference).toLocaleString("en-IN");

            let status;
            let message;

            if (difference > 500) {
                status = "Possibly Overpriced";
                message = "The current price is above the model's estimated fair price.";
            } else if (difference < -500) {
                status = "Possibly Underpriced";
                message = "The current price is below the model's estimated fair price.";
            } else {
                status = "Fair Price";
                message = "The current price is close to the model's estimated fair price.";
            }

            comparisonResult.querySelector("strong").textContent = status;
            comparisonResult.querySelector("p").textContent = message;

        } else {
            currentPriceElement.textContent = "₹—";
            differenceElement.textContent = "—";

            comparisonResult.querySelector("strong").textContent =
                "Price Prediction Ready";

            comparisonResult.querySelector("p").textContent =
                "The estimated fair price is based on the trained machine learning model.";
        }

    } catch (error) {
        console.error("Prediction error:", error);

        document.getElementById("predictedPrice").textContent = "Error";

        document.getElementById("comparisonResult").querySelector("strong").textContent =
            "Prediction Failed";

        document.getElementById("comparisonResult").querySelector("p").textContent =
            "Please make sure the ML API is running.";
    }
});