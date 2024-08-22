let users = [
  { username: "Sofia Mueller", email: "sofiam@web.de", password: "test1234" },
];

function addUser() {
  let username = document.getElementById("userName").value;
  let email = document.getElementById("emailInput").value;
  let password = document.getElementById("userPassword").value;
  let confirmPassword = document.getElementById("confirmUserPassword").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return false;
  }

  if (document.getElementById("acceptPp").checked != true) {
    alert("Please accept the Privacy Policy");
    return false;
  }

  const userExists = users.some((user) => user.email === email);

  if (userExists) {
    alert("An account with this email already exists!");
  } else {
    users.push({ name: username, email: email, password: password });
    alert("User registered successfully!");
  }

  document.getElementById("userName").value = "";
  document.getElementById("emailInput").value = "";
  document.getElementById("userPassword").value = "";
  document.getElementById("confirmUserPassword").value = "";

  return false;
}
