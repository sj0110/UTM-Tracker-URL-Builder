// Sample data for Campaign Source and Mediums
const sourcesAndMediums = {
    "Google": ["App_Ad", "Carousal_Ad", "DemandGen_Ad", "Display_Ad", "Image_Ad", "PerformanceMax_Ad", "Search_Ad", "Shopping_Ad", "Smart_Ad", "Text_Ad", "Video_Ad"],
    "LinkedIn": ["Carousal_Ad", "Conversational_Ad", "Document_Ad", "Event_Ad", "Image_Ad", "InMail", "Spotlight_Ad", "Text_Ad", "Video_Ad"],
    "Facebook": ["Carousal_Ad", "Image_Ad", "Text_Ad", "Video_Ad"],
    "X": ["Carousal_Ad", "Image_Ad", "Text_Ad", "Video_Ad"],
    "Email": ["ABM", "EDM", "Newsletter"],
    "Social_Media": ["Organic_Post"],
    "Content_Syndication": ["Case_Study", "Folloze", "Hubilo", "WhitePaper"],
    "Event": ["Fireside_Chat", "One_to_One_Connect", "Roadshow", "Round_Table", "Webinar"]
};

function updateMediumOptions() {
    const sourceSelect = document.getElementById("campaignSource");
    const mediumSelect = document.getElementById("campaignMedium");
    const selectedSource = sourceSelect.value;

    // Clear existing options
    mediumSelect.innerHTML = '';

    // Add placeholder text for the medium dropdown
    const placeholderOption = document.createElement('option');
    placeholderOption.text = "Select Campaign Source First";
    placeholderOption.value = "";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    mediumSelect.add(placeholderOption);

    // Enable medium select if source is selected
    mediumSelect.disabled = selectedSource === "";

    // Maintain a set of added mediums to prevent duplicates
    const addedMediums = new Set();

    // Populate options based on selected source
    if (selectedSource === "Other") {
        for (const source in sourcesAndMediums) {
            sourcesAndMediums[source].forEach(medium => {
                // Only add the medium if it hasn't been added already
                if (!addedMediums.has(medium)) {
                    const option = document.createElement('option');
                    option.text = medium;
                    option.value = medium;
                    mediumSelect.add(option);
                    addedMediums.add(medium);
                }
            });
        }
        // Add "Other" option
        const otherOption = document.createElement('option');
        otherOption.text = "Other";
        otherOption.value = "Other";
        mediumSelect.add(otherOption);
    } else {
        // Populate options based on selected source
        if (selectedSource in sourcesAndMediums) {
            sourcesAndMediums[selectedSource].forEach(medium => {
                const option = document.createElement('option');
                option.text = medium;
                option.value = medium;
                mediumSelect.add(option);
            });
        }
        // Add "Other" option
        const otherOption = document.createElement('option');
        otherOption.text = "Other";
        otherOption.value = "Other";
        mediumSelect.add(otherOption);
    }

    // Hide the "Other" input field
    document.getElementById("otherMedium").style.display = "none";
}

// Function to validate form fields
function validateForm() {
    const url = document.getElementById("url").value.trim();
    const campaignSource = document.getElementById("campaignSource").value;
    const campaignMedium = document.getElementById("campaignMedium").value;
    const campaignName = document.getElementById("campaignName").value.trim();
    const region = document.getElementById("region").value;
    const country = document.getElementById("country").value.trim();
    const marketSegment = document.getElementById("marketSegment").value;

    if (!url || !campaignSource || !campaignMedium || !campaignName || !region || !marketSegment) {
        document.getElementById("warningMessage").innerText = "Please fill in all fields.";
        document.getElementById("warningMessage").style.display = "block";
        
        // Clear result and hide copy button
        document.getElementById("result").innerText = "";
        document.getElementById("result").style.display = "none";
        document.getElementById("copyButton").style.display = "none";
        
        return false;
    }

    // Validate URL format
    if (!validateURL(url)) {
        document.getElementById("warningMessage").innerText = "Please enter a valid URL.";
        document.getElementById("warningMessage").style.display = "block";
        
        // Clear result and hide copy button
        document.getElementById("result").innerText = "";
        document.getElementById("result").style.display = "none";
        document.getElementById("copyButton").style.display = "none";
        
        return false;
    }

    // Hide warning message if all conditions are met
    document.getElementById("warningMessage").style.display = "none";
    return true;
}

// Function to validate URL format
function validateURL(url) {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

// Function to generate the UTM URL
function generateURL() {
    // Clear result
    document.getElementById("result").innerText = "";
    document.getElementById("result").style.display = "none";

    if (!validateForm()) {
        // Hide copy button if form validation fails
        document.getElementById("copyButton").style.display = "none";
        return;
    }

    let url = document.getElementById("url").value.trim();
    let campaignSource = document.getElementById("campaignSource").value;
    let campaignMedium = document.getElementById("campaignMedium").value;
    const campaignName = document.getElementById("campaignName").value.trim();
    const campaignTerm = document.getElementById("campaignTerm").value.trim();
    const campaignContent = document.getElementById("campaignContent").value.trim();
    let region = document.getElementById("region").value.trim();
    const country = document.getElementById("country").value.trim();
    let marketSegment = document.getElementById("marketSegment").value.trim();

    // Check if source, medium, or region is "Other" and corresponding input field is empty
    if ((campaignSource === "Other" && document.getElementById("otherSource").value.trim() === "") ||
        (campaignMedium === "Other" && document.getElementById("otherMedium").value.trim() === "") ||
        (region === "Other" && document.getElementById("otherRegion").value.trim() === "") ||
        (marketSegment === "Other" && document.getElementById("otherMarketSegment").value.trim() === "")) {
        document.getElementById("warningMessage").innerText = "Please enter a value for 'Other' options.";
        document.getElementById("warningMessage").style.display = "block";
        // Hide copy button if any "Other" option is empty
        document.getElementById("copyButton").style.display = "none";
        return;
    }

    // Automatically prepend "http://" to the URL if it does not start with "http://" or "https://"
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "http://" + url;
    }

    // If the source is "Other", use the custom input as source
    if (campaignSource === "Other") {
        campaignSource = document.getElementById("otherSource").value.trim();
    }

    // If the medium is "Other", use the custom input as medium
    if (campaignMedium === "Other") {
        campaignMedium = document.getElementById("otherMedium").value.trim();
    }

    // If the region is "Other", use the custom input as region
    if (region === "Other") {
        region = document.getElementById("otherRegion").value.trim();
    }

    // If the market segment is "Other", use the custom input as market segment
    if (marketSegment === "Other") {
        marketSegment = document.getElementById("otherMarketSegment").value.trim();
    }

    // Construct the UTM URL with parameters in the same order as the form fields
    let utmURL = `${url}?utm_source=${campaignSource}&utm_medium=${campaignMedium}`;
    if (campaignName) {
        utmURL += `&utm_campaign=${encodeURIComponent(campaignName)}`;
    }
    if (campaignTerm) {
        utmURL += `&utm_term=${encodeURIComponent(campaignTerm)}`;
    }
    if (campaignContent) {
        utmURL += `&utm_content=${encodeURIComponent(campaignContent)}`;
    }
    utmURL += `&utm_region=${encodeURIComponent(region)}`;
    if (country) {
        utmURL += `&utm_country=${encodeURIComponent(country)}`;
    }
    utmURL += `&utm_segment=${encodeURIComponent(marketSegment)}`;

    // Check if the URL length exceeds the limit
    if (utmURL.length > 2048) {
        document.getElementById("warningMessage").innerText = "The generated URL exceeds the ideal size limit (2048 characters). Please consider shortening it.";
        document.getElementById("warningMessage").style.display = "block";
        // Hide copy button if URL length exceeds the limit
        document.getElementById("copyButton").style.display = "none";
        return;
    }

    // Display the generated URL
    document.getElementById("result").innerText = utmURL;
    document.getElementById("result").style.display = "block";

    // Show copy button only when URL is generated successfully
    document.getElementById("copyButton").style.display = "block";
    document.getElementById("shortenButton").style.display = "block";
    document.getElementById("warningMessage").style.display = "none";
}

function shortenURL() {
    const longURL = document.getElementById("result").innerText;
    const apiUrl = `https://api-ssl.bitly.com/v4/shorten`;

    const accessToken = "2a5e0b6ab0a2fef58d31db49cfd5bc9575fd7378"; // Replace this with your actual Bitly access token

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ long_url: longURL })
    })
    .then(response => response.json())
    .then(data => {
        if (data.link) {
            const shortURL = data.link;
            document.getElementById("shortResult").innerText = shortURL;
            document.getElementById("shortResult").style.display = "block";
            document.getElementById("copyShortButton").style.display = "block";
        } else {
            document.getElementById("warningMessage").innerText = "Failed to shorten the URL. Please try again.";
            document.getElementById("warningMessage").style.display = "block";
        }
    })
    .catch(error => {
        document.getElementById("warningMessage").innerText = "An error occurred. Please try again.";
        document.getElementById("warningMessage").style.display = "block";
    });
}

function copyShortURL() {
    const shortUrlElement = document.getElementById("shortResult");
    const range = document.createRange();
    range.selectNode(shortUrlElement);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
    alert("Shortened URL copied to clipboard!");
}


// Function to copy the generated URL
function copyURL() {
    const urlElement = document.getElementById("result");
    const range = document.createRange();
    range.selectNode(urlElement);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
    alert("URL copied to clipboard!");
}

// Function to handle region change
function handleRegionChange() {
    const region = document.getElementById("region").value;
    const countryField = document.getElementById("country");
    const otherRegionField = document.getElementById("otherRegion");

    countryField.disabled = region === "";
    countryField.placeholder = region === "" ? "Select the Region first" : "Enter Country";

    if (region === "Other") {
        otherRegionField.style.display = "block";
    } else {
        otherRegionField.style.display = "none";
    }
}

// Function to handle "Other" selection
function handleOtherSelection(selectId, otherInputId) {
    const selectElement = document.getElementById(selectId);
    const otherInputElement = document.getElementById(otherInputId);

    selectElement.addEventListener("change", function () {
        if (this.value === "Other") {
            otherInputElement.style.display = "block";
        } else {
            otherInputElement.style.display = "none";
        }
    });
}

// Initialize the "Other" selection for each dropdown
handleOtherSelection("campaignSource", "otherSource");
handleOtherSelection("campaignMedium", "otherMedium");
handleOtherSelection("region", "otherRegion");
handleOtherSelection("marketSegment", "marketSegment");

// Initialize medium options on page load
updateMediumOptions();

// Enable or disable country field based on initial region selection
handleRegionChange();
