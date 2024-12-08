console.log("hello");
const frname = document.querySelector("#fname");
const lrname = document.querySelector("#lname");
const emailr = document.querySelector("#email");
const phnumr = document.querySelector("#phnum");
const passwordr = document.querySelector("#password");
const form = document.querySelector("#form");
const messageDiv = document.createElement("div"); // For displaying messages
document.body.appendChild(messageDiv); // Add it to the body

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Collect form data
  const data = {
    fname: frname.value,
    lname: lrname.value,
    email: emailr.value,
    phnum: phnumr.value,
    password: passwordr.value,
  };

  try {
    // Send the form data to the backend
    const response = await fetch("http://localhost:3000/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      // Display success message
      messageDiv.textContent = "Data submitted successfully!";
      messageDiv.style.color = "green";

      // Fetch the latest data to display it
      const fetchData = await fetch("http://localhost:3000/latest-user");
      const userData = await fetchData.json();

      // Display the fetched data
      const userDisplayDiv = document.createElement("div");
      userDisplayDiv.innerHTML = `
        <h3>Submitted Data:</h3>
        <p>First Name: ${userData[0].firstName}</p>
        <p>Last Name: ${userData[0].lastName}</p>
        <p>Email: ${userData[0].email}</p>
        <p>Phone: ${userData[0].phone}</p>
      `;
      document.body.appendChild(userDisplayDiv);

      // Reset the form fields
      form.reset();
    } else {
      // Display error message
      messageDiv.textContent = "Failed to submit data. Please try again.";
      messageDiv.style.color = "red";
    }
  } catch (error) {
    console.error(error);
    // Display error message
    messageDiv.textContent = "An error occurred. Please check the console.";
    messageDiv.style.color = "red";
  }
});
