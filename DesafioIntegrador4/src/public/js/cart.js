const removeFromCartForms = document.querySelectorAll(
    '[id^="removeFromCartForm-"]'
  );

  const cartId = document.getElementById("cartId").textContent;

  removeFromCartForms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const productId = form.getAttribute("id").split("-")[1];
      // const prodTitle = form
      //   .closest(".max-w-4xl")
      //   .querySelector("h5").textContent;
   

      fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: "DELETE",
      })
        .then(() => {
          Swal.fire({
            title: "Product removed from cart!",
            text: `You removed this product from the cart`,
            footer: "Reloading page in 4s",
            toast: true,
            position: "top-right",
            icon: "success",
          
          });
          setTimeout(() => {
            location.reload();
          }, 4000);
        })
        .catch((error) => console.log(error));
    });
  });
  