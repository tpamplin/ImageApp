const url = "http://localhost:8080/images";

const uploadFile = async () => {
    const fileInput = document.getElementById("file-upload");
    const file = fileInput.files[0];

    if (!file) {
        alert("Select a file");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch(url, {
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

const loadFiles = async () => {
    const library = document.getElementById("image-library");

    while (library.firstChild) {
        library.removeChild(library.lastChild);
    }

    try {
        const response = await fetch(url);

        if (response.ok) {
            const result = await response.json();
            console.log(result);

            for (let i = 0; i < result.length; i++) {
                const imageEntry = document.createElement("p");
                const textNode = document.createTextNode(result[i]);
                imageEntry.appendChild(textNode);
                library.appendChild(imageEntry);
            }
        } else {
            console.error(error);
            alert("Failed to load library.");
        }
    } catch (error) {
        console.error(error);
        alert("something went wrong while trying to load library.");
    }
};

loadFiles();

const downloadFile = async () => {};
