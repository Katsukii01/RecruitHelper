import React, { useState } from "react";
import { DsectionWrapper } from "../../hoc/index";
import { finishRecruitment } from "../../services/RecruitmentServices";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { exportApplicantsToExcel, exportOfferDataToExcel, exportRecruitmentStats, exportMeetings, exportTasks } from "../ExcelExports"; // Importujemy funkcję

const FinishRecruitment = ({ id }) => {
  const [loading, setLoading] = useState(false);

  const exportDataToExcel = async () => {
    setLoading(true);
    try {
      const response = await finishRecruitment(id);
      console.log("✅ API response:", response);

      const {
        recruitmentStats = [],
        sortedApplicants = [],
        meetings = [],
        tasks = [],
        offerData = [],
      } = response || {}; // Zapobiega błędom, jeśli response.data jest null/undefined

      // Tworzymy nowy skoroszyt
      const workbook = XLSX.utils.book_new();

      exportRecruitmentStats(workbook, recruitmentStats);
      exportOfferDataToExcel(workbook, offerData);
      exportApplicantsToExcel(workbook, sortedApplicants);
      exportMeetings(workbook, meetings);
      exportTasks(workbook, tasks);

      // Eksportowanie pliku
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const excelBlob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(excelBlob, "recruitment.xlsx");

      alert("Data exported successfully");
    } catch (error) {
      console.error("❌ Error exporting data:", error);
      alert("Error exporting data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full h-screen-80 mx-auto p-4 bg-glass card">
      <h1 className="text-2xl font-bold text-white mb-4">Finish Recruitment</h1>
      <button
        onClick={exportDataToExcel}
        className="px-4 py-2 bg-blue-500 text-white rounded"
        disabled={loading}
      >
        {loading ? "Exporting..." : "Export to Excel"}
      </button>
    </section>
  );
};

export default DsectionWrapper(FinishRecruitment, "FinishRecruitment");
