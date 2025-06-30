**Dusangire Lunch – Frontend**

**Overview**

The **Dusangire Lunch Frontend** is a React-based web application designed for administrators and superusers to manage school feeding contributions in Rwanda. This platform supports viewing, uploading, editing, and analyzing donation and distribution records.

This interface is tailored for:

* Admins to monitor data and request changes.
* Superusers to approve or delete sensitive entries.
* Reporting, filtering, searching, and Excel integration.

Built with modern tools:

* React (with TypeScript)
* Tailwind CSS
* Axios for API requests
* Vite for bundling

Key Features

* **Authentication-based dashboards** for Admin and Superuser
* **Data Views:** Schools, Transfers, Distributions, Reports, Pending and Trash
* **Soft Deletion Logic:** Only superusers can confirm delete requests
* **Excel Uploads** for bulk transfer data
* **Real-time Filtering, Pagination, and Search**
* **Report Generation and PDF/Excel Download**
* **Contribution Summary** with calculated balance
* **Modular Design** with reusable components and API integration

Project Structure

src/

* components: -AdminLayout.jsx and ContributionForm.jsx
* Pages: AdminDashboard.jsx, ContributionList.jsx, DistributionsPage.jsx, ReportsPage.jsx, LoginPage.jsx, PendingDeletion.jsx and TrashPage.jsx
* Services: api.js and auth.js
* utils: App.jsx and main.jsx

Dashboard Login Credentials

* AdminUser Name:
  aline
* Password:
  aline12345
  
* SuperUser's name:
  admin
* Password:
  admin123

Open your browser at http://localhost:5173/


