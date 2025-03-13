//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const exportApplicantsToExcel = (workbook, applicants, t) => {
  if (!applicants || !Array.isArray(applicants) || applicants.length === 0) {
    console.warn("⚠ No applicants data to export.");
    return;
  }

  // 🔹 Tworzymy nowy arkusz
  const sheet = workbook.addWorksheet( t("ExcelExport.Applicants"));

  // 🔹 Definiujemy kolumny
  sheet.columns = [
    { header: "ID", key: "id", width: 5 },
    { header: t("ExcelExport.Name"), key: "name", width: 15 },
    { header: t("ExcelExport.Surname"), key: "surname", width: 15 },
    { header: t("ExcelExport.Email"), key: "email", width: 25 },
    { header: t("ExcelExport.Phone"), key: "phone", width: 15 },
    { header: t("ExcelExport.Education Level"), key: "educationLevel", width: 20 },
    { header: t("ExcelExport.Institution Name"), key: "institutionName", width: 25 },
    { header: t("ExcelExport.Education Field"), key: "educationField", width: 20 },
    { header: t("ExcelExport.Experience"), key: "experience", width: 15 },
    { header: t("ExcelExport.Skills"), key: "skills", width: 40 },
    { header: t("ExcelExport.Courses"), key: "courses", width: 40 },
    { header: t("ExcelExport.Languages"), key: "languages", width: 40 },
    { header: t("ExcelExport.Additional Information"), key: "additionalInformation", width: 30 },
  ];
  

  // 🔹 Stylizacja nagłówków (ciemnogranatowy dla lepszego kontrastu)
  const headerRow = sheet.getRow(1);
  headerRow.eachCell(cell => {
    cell.font = { bold: true, color: { argb: "FFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "1F4E78" } };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = { top: { style: "thick" }, bottom: { style: "thick" }, left: { style: "thin" }, right: { style: "thin" } };
    
  });


// 🔹 Dodanie danych aplikantów
applicants.forEach((app, index) => {
  const rowData = {
    id: app.id || "N/A",
    name: app.name || "N/A",
    surname: app.surname || "N/A",
    email: app.email || "N/A",
    phone: app.phone || "N/A",
    educationLevel: app.educationLevel || "N/A",
    institutionName: app.institutionName || "N/A",
    educationField: app.educationField || "N/A",
    experience: app.experience || "N/A",
    skills: Array.isArray(app.skills) ? app.skills.join(", ") : "N/A",
    courses: Array.isArray(app.courses) ? app.courses.join(", ") : "N/A",
    languages: Array.isArray(app.languages)
      ? app.languages.map((lang) => `${lang.language} (${lang.level})`).join(", ")
      : "N/A",
    additionalInformation: app.additionalInformation || "N/A",
  };

  const row = sheet.addRow(rowData);

  // 🔹 Oblicz długość najdłuższego tekstu w wierszu
  const maxLength = Math.max(...Object.values(rowData).map(value => value.length));

  // 🔹 Dynamiczna wysokość wiersza na podstawie długości tekstu (20 px + 5 px na każde 50 znaków)
  row.height = 20 + Math.ceil(maxLength / 50) * 5;

  row.eachCell(cell => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: index % 2 === 0 ? "F2F2F2" : "D9E1F2" }, // Naprzemienne kolory
    };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    cell.alignment = { vertical: "middle", wrapText: true };
  });
});


  sheet.addRow([]);
  sheet.addRow([]);
  
  // 🔹 Definicja wyników
  const scoreFields = [
    { field: "totalScore", label: t("ExcelExport.Total Score (%)") },
    { field: "CVscore", label: t("ExcelExport.CV Score (%)") },
    { field: "CLscore", label: t("ExcelExport.Cover Letter Score (%)") },
    { field: "Meetingsscore", label: t("ExcelExport.Meetings Score (%)") },
    { field: "Tasksscore", label: t("ExcelExport.Tasks Score (%)") },
    { field: "adnationalPoints", label: t("ExcelExport.Adnational Points (%)") }
  ];
  

  // 🔹 Dodanie tabeli wyników
  scoreFields.forEach((scoreField) => {
    // Dodajemy nagłówki dla wyników
    const row = sheet.addRow([ t("ExcelExport.Applicant"), scoreField.label]);

    // Stylizacja nagłówków
    row.eachCell(cell => {
      cell.font = { bold: true, color: { argb: "FFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "333F50" } };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = { top: { style: "thick" }, bottom: { style: "thick" }, left: { style: "thin" }, right: { style: "thin" } };
    });
  
    // Dodajemy dane dla każdego aplikanta
    applicants.forEach((app, index) => {
      const score = app[scoreField.field] || 0;
      const rowData = [`${app.name} ${app.surname}`, score];
      const dataRow = sheet.addRow(rowData);

      // Zmieniamy kolor wiersza w tabeli wyników
      dataRow.eachCell(cell => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: index % 2 === 0 ? "E8F4FF" : "D9E1F2" }, // Naprzemienne kolory
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = { vertical: "middle", wrapText: true };
      });


    });

    // 🔹 Dostosowanie szerokości kolumn w tabelach wyników do długości nagłówków
    const headerLength = Math.max(...scoreFields.map(sf => sf.label.length));
    sheet.getColumn(1).width = 15; // Szerokość dla kolumny "Applicant"
    sheet.getColumn(2).width = headerLength + 5; // Dostosowanie szerokości do długości nagłówka

    // Dodajemy odstęp między tabelami wyników
    sheet.addRow([]);
  });

};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const exportOfferDataToExcel = (workbook, offerData, t) => {
  if (!offerData || typeof offerData !== "object") {
    console.warn("⚠ offerData is not an object or is undefined:", offerData);
    return;
  }

  const formattedOfferData = Array.isArray(offerData) ? offerData[0] : offerData;

  const offerSheetData = Object.entries({
    [t("ExcelExport.Job Title")]: formattedOfferData.jobTitle || "N/A",
    [t("ExcelExport.Experience")]: formattedOfferData.experienceNeeded || "N/A",
    [t("ExcelExport.Education Level")]: formattedOfferData.educationLevel || "N/A",
    [t("ExcelExport.Education Field")]: formattedOfferData.educationField || "N/A",
    [t("ExcelExport.Courses")]: Array.isArray(formattedOfferData.courses) 
      ? formattedOfferData.courses.join(", ") 
      : "N/A",
    [t("ExcelExport.Skills")]: Array.isArray(formattedOfferData.skills) 
      ? formattedOfferData.skills.join(", ") 
      : "N/A",
    [t("ExcelExport.Languages")]: Array.isArray(formattedOfferData.languages)
      ? formattedOfferData.languages.map(lang => `${lang.language} (${lang.level})`).join(", ")
      : "N/A",
    [t("ExcelExport.Location")]: formattedOfferData.location || "N/A",
  });
  

  const sheet = workbook.addWorksheet( t("ExcelExport.Offer Data"));

  // 🔹 Definiujemy kolumny
  sheet.columns = [
    { header: t("ExcelExport.Category"), key: "category", width: 35 },
    { header: t("ExcelExport.Details"), key: "details", width: 70 },
  ];
  

  // 🔹 Stylizacja nagłówków (ciemnogranatowy dla lepszego kontrastu)
  const headerRow = sheet.getRow(1);
  headerRow.eachCell(cell => {
    cell.font = { bold: true, color: { argb: "FFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "1F4E78" } };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = { top: { style: "thick" }, bottom: { style: "thick" }, left: { style: "thin" }, right: { style: "thin" } };
  });

  // 🔹 Dodanie danych do arkusza z lepszym stylem
  offerSheetData.forEach(([category, details], index) => {
    const row = sheet.addRow({ category, details });

    row.eachCell(cell => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: index % 2 === 0 ? "F2F2F2" : "D9E1F2" }, // Naprzemienne kolory
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      cell.alignment = { vertical: "middle", wrapText: true };
    });

    // 🔹 Automatyczne dostosowanie wysokości wiersza dla Skills
    if (category === "Skills") {
      const estimatedLines = Math.ceil(details.length / 50); // Przyjmujemy ok. 50 znaków na linię
      row.height = Math.max(20, estimatedLines * 15); // Podstawowa wysokość + dodatkowe linie
    }
  });

  // 🔹 Automatyczne dopasowanie wysokości wierszy dla długich treści
  sheet.eachRow(row => {
    if (!row.height) {
      row.height = 20;
    }
  });
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const exportRecruitmentStats = (workbook, recruitmentStats, t) => {
  if (!recruitmentStats || typeof recruitmentStats !== "object") {
    console.warn("⚠ recruitmentStats is not an object or is undefined:", recruitmentStats);
    return;
  }

  const formattedRecruitmentStats = Array.isArray(recruitmentStats) ? recruitmentStats[0] : recruitmentStats;

  const recruitmentStatsSheetData = [
    [t("ExcelExport.Total Applicants"), formattedRecruitmentStats.totalApplicants || 0],
    [t("ExcelExport.Total Meetings"), formattedRecruitmentStats.totalMeetings || 0],
    [t("ExcelExport.Total Tasks"), formattedRecruitmentStats.totalTasks || 0],
    [t("ExcelExport.Highest Total Score"), formattedRecruitmentStats.highestTotalScore || 0],
    [t("ExcelExport.Average Total Score"), formattedRecruitmentStats.averageTotalScore || 0],
    [t("ExcelExport.Current Stage"), formattedRecruitmentStats.CurrentStage || "N/A"],
    [t("ExcelExport.Total Cover Letters Percentage"), formattedRecruitmentStats.TotalCoverLettersPercentage || "0%"],
    ["", ""], // Pusta linia dla czytelności
    [t("ExcelExport.Applicants in Each Stage"), ""], // 🔹 Ten wiersz dostaje styl nagłówka
  ];
  
  const stages = [
    "Checked",
    "To be checked",
    "Rejected",
    "Tasks",
    "Invited for interview",
    "Interviewed",
    "Offered",
    "Hired",
  ];

  stages.forEach(stage => {
    const count = formattedRecruitmentStats.ApplicantsInEachStage?.[stage] || 0;
    recruitmentStatsSheetData.push([t(`ExcelExport.Applicants in ${stage}`), count]);
  });

  const sheet = workbook.addWorksheet( t("ExcelExport.Recruitment Statistics"));

  sheet.columns = [
    { header: t("ExcelExport.Category"), key: "category", width: 35 },
    { header: t("ExcelExport.Details"), key: "details", width: 25 },
  ];
  // 🔹 Stylizacja nagłówka (ciemnogranatowy)
  const headerRow = sheet.getRow(1);
  headerRow.eachCell(cell => {
    cell.font = { bold: true, color: { argb: "FFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "1F4E78" } };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = { top: { style: "thick" }, bottom: { style: "thick" }, left: { style: "thin" }, right: { style: "thin" } };
  });

  // 🔹 Dodanie danych do arkusza
  recruitmentStatsSheetData.forEach(([category, details], index) => {
    const row = sheet.addRow({ category, details });

    row.eachCell(cell => {
      if (category === "Applicants in Each Stage" || category === "Kandydaci na każdym etapie") {
        // 🔹 Stylizacja nagłówka dla "Applicants in Each Stage"
        cell.font = { bold: true, color: { argb: "FFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "333F50" } };
        cell.border = { top: { style: "thick" }, bottom: { style: "thick" }, left: { style: "thin" }, right: { style: "thin" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      } else {
        // 🔹 Normalne komórki
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: index % 2 === 0 ? "E8F4FF" : "D9E1F2" },
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      }
    });
  });

  // 🔹 Dopasowanie wysokości wierszy
  sheet.eachRow(row => {
    row.height = 20;
  });
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


export const exportMeetings = (workbook, meetings, t) => {
  if (!meetings || !Array.isArray(meetings) || meetings.length === 0) {
    console.warn("⚠ Meetings data is missing or not an array:", meetings);
    return;
  }

  const worksheet = workbook.addWorksheet(t("ExcelExport.Meetings"));

  meetings.forEach(meeting => {
    // 🔹 Nagłówek dla sesji spotkań (grubsza linia)
    const sessionHeader = worksheet.addRow([
      t("ExcelExport.Meeting Session Name"),
      t("ExcelExport.Description"),
      t("ExcelExport.Points weight")
    ]);
    sessionHeader.eachCell(cell => {
      cell.font = { bold: true, color: { argb: "FFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "333F50" } }; // Ciemny niebiesko-szary
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = { bottom: { style: "thick", color: { argb: "000000" } } }; // Pogrubiona dolna linia
    });

    // 🔹 Dane sesji spotkań
    const sessionData = worksheet.addRow([
      meeting.meetingSessionName || "N/A",
      meeting.meetingSessionDescription || "N/A",
      meeting.meetingSessionPointsWeight || "N/A",
    ]);

    sessionData.eachCell(cell => {
      cell.font = { bold: true };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "E8F4FF" } }; // Jasnoniebieskie tło
      cell.alignment = { horizontal: "left", vertical: "middle" };
      cell.border = { bottom: { style: "thin", color: { argb: "CCCCCC" } } };
    });

    worksheet.addRow([]); // Pusta linia dla czytelności

    if (meeting.meetings && meeting.meetings.length > 0) {

      // 🔹 Nagłówek dla pojedynczych spotkań (grubsza linia)
      const meetingsHeader = worksheet.addRow([
        t("ExcelExport.Meeting ID"),
        t("ExcelExport.Applicant ID"),
        t("ExcelExport.Date"),
        t("ExcelExport.Time From"),
        t("ExcelExport.Time To"),
        t("ExcelExport.Points")
      ]);

      meetingsHeader.eachCell(cell => {
        cell.font = { bold: true, color: { argb: "FFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "1F4E78" } }; // Ciemnoniebieskie tło
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = { bottom: { style: "thick", color: { argb: "000000" } } };
      });

      meeting.meetings.forEach((meetingDetail, index) => {
        const row = worksheet.addRow([
          meetingDetail.id || "N/A",
          meetingDetail.applicantId || "N/A",
          meetingDetail.meetingDate || "N/A",
          meetingDetail.meetingTimeFrom || "N/A",
          meetingDetail.meetingTimeTo || "N/A",
          meetingDetail.points || "N/A",
        ]);

        row.alignment = { horizontal: "left" };

        // 🔹 Alternatywne kolory dla lepszej czytelności (bardziej profesjonalne)
        row.eachCell(cell => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: index % 2 === 0 ? "F2F2F2" : "D9E1F2" }, // Szaro-niebieskie pasy
          };
          cell.border = { bottom: { style: "thin", color: { argb: "CCCCCC" } } };
        });
      });
    }

    // 🔹 Puste wiersze dla lepszej separacji sekcji
    worksheet.addRow([]);
    worksheet.addRow([]);
  });

  // 🔹 Automatyczne dopasowanie szerokości kolumn
  worksheet.columns.forEach(column => {
    let maxLength = 10;
    column.eachCell({ includeEmpty: true }, cell => {
      const cellLength = cell.value ? cell.value.toString().length : 0;
      if (cellLength > maxLength) {
        maxLength = cellLength;
      }
    });
    column.width = maxLength + 2;
  });
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const exportTasks = (workbook, tasks, t) => {
  if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
    console.warn("⚠ Tasks data is missing or not an array:", tasks);
    return;
  }

  const worksheet = workbook.addWorksheet(t("ExcelExport.Tasks"));

  tasks.forEach(task => {
    // 🔹 Nagłówek dla sesji zadań (gruba linia)
    const sessionHeader = worksheet.addRow([
      t("ExcelExport.Task Session Name"),
      t("ExcelExport.Description"),
      t("ExcelExport.Points weight")
    ]);
    

    sessionHeader.eachCell(cell => {
      cell.font = { bold: true, color: { argb: "FFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "333F50" } }; // Ciemnoniebiesko-szary
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = { bottom: { style: "thick", color: { argb: "000000" } } }; // Gruba linia pod nagłówkiem
    });

    // 🔹 Dane sesji
    const sessionData = worksheet.addRow([
      task.taskSessionName || "N/A",
      task.taskSessionDescription || "N/A",
      task.taskSessionPointsWeight || "N/A",
    ]);

    sessionData.eachCell(cell => {
      cell.font = { bold: true };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "E8F4FF" } }; // Jasnoniebieskie tło
      cell.alignment = { horizontal: "left", vertical: "middle" };
      cell.border = { bottom: { style: "thin", color: { argb: "CCCCCC" } } };
    });

    worksheet.addRow([]); // Pusta linia dla czytelności

    if (task.tasks && task.tasks.length > 0) {
      // 🔹 Nagłówek dla listy zadań (gruba linia)
      const tasksHeader = worksheet.addRow([
        t("ExcelExport.Task ID"),
        t("ExcelExport.Applicant ID"),
        t("ExcelExport.Points")
      ]);
      

      tasksHeader.eachCell(cell => {
        cell.font = { bold: true, color: { argb: "FFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "1F4E78" } }; // Ciemnoniebieskie tło
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = { bottom: { style: "thick", color: { argb: "000000" } } };
      });

      task.tasks.forEach((taskDetail, index) => {
        const row = worksheet.addRow([
          taskDetail.id || "N/A",
          taskDetail.applicantId || "N/A",
          taskDetail.points || "N/A",
        ]);

        row.alignment = { horizontal: "left" };

        // 🔹 Naprzemienne kolory dla lepszej czytelności (bardziej eleganckie)
        row.eachCell(cell => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: index % 2 === 0 ? "F2F2F2" : "D9E1F2" }, // Szaro-niebieskie pasy
          };
          cell.border = { bottom: { style: "thin", color: { argb: "CCCCCC" } } };
        });
      });
    }

    // 🔹 Puste wiersze dla lepszej separacji sekcji
    worksheet.addRow([]);
    worksheet.addRow([]);
  });

  // 🔹 Automatyczne dopasowanie szerokości kolumn
  worksheet.columns.forEach(column => {
    let maxLength = 10;
    column.eachCell({ includeEmpty: true }, cell => {
      const cellLength = cell.value ? cell.value.toString().length : 0;
      if (cellLength > maxLength) {
        maxLength = cellLength;
      }
    });
    column.width = maxLength + 2;
  });
};


