const uploadFile = async () => {
    const fileInput = document.getElementById("file-upload");
    const file = fileInput.files[0];

    if (!file) {
        alert("Select a file");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const url = "http://localhost:8080";

    try {
        const response = await fetch(url + "/images", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            console.log("Success: ", result);
            alert("File uploaded successfully!");
        } else {
            console.error("Error: ", response.statusText);
            alert("File upload failed");
        }
    } catch (error) {
        console.error("Error", error);
        alert("An error occured during upload.");
    }
};
