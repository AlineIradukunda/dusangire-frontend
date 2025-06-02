import API from './api'; // Adjust the import path as necessary

const requestReport = async () => {
  try {
    const response = await API.generateReport({
      report_name: "Monthly Report",
      start_date: "2025-05-01",
      end_date: "2025-05-31",
    });
    console.log("Report generated:", response.data);
    // You can now use response.data to display the report details in your UI
  } catch (error) {
    console.error("Error generating report:", error.response?.data || error.message);
    // Handle error appropriately in your UI
  }
};

requestReport();
