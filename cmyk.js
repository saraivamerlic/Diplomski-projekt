document.addEventListener("DOMContentLoaded", function () {

    const interactiveBlocks = document.querySelectorAll(".interactive-cmyk");

    interactiveBlocks.forEach(function (block) {

        const buttons = block.querySelectorAll("[data-cmyk]");
        const image = block.querySelector(".cmyk-source-image");

        if (!image) return;

        buttons.forEach(function (button) {

            button.addEventListener("click", function () {

                const channel = button.getAttribute("data-cmyk");

                if (channel === "C") {

                    image.style.filter =
                        "grayscale(1) sepia(1) hue-rotate(130deg) saturate(8)";

                }

                else if (channel === "M") {

                    image.style.filter =
                        "grayscale(1) sepia(1) hue-rotate(290deg) saturate(8)";

                }

                else if (channel === "Y") {

                    image.style.filter =
                        "grayscale(1) sepia(1) hue-rotate(20deg) saturate(8)";

                }

                else if (channel === "K") {

                    image.style.filter =
                        "grayscale(1)";

                }

                else if (channel === "CMYK") {

                    image.style.filter =
                        "none";

                }

            });

        });

    });

});