export const MainDashboardTopTabLists = [
  {name: 'Details', id: 'account-details', 'order': 1},
  { name: 'Sites', id: 'site-tab', 'order': 2 },
  { name: 'Contacts', id: 'contact-tab', 'order': 3 },
  { name: 'Equipment', id: 'equipment-tab', 'order': 4 },
  { name: 'Training', id: 'training-tab', 'order': 5 },
  { name: 'Inperson', id: "inperson-tab", 'order': 6 },
  { name: 'POPS', id: "pops-tab", 'order': 7 },
  { name: 'Classes', id: 'classes-tab', 'order': 5 },
  { name: 'Notes', id: 'notes-tab', 'order': 8 },
  { name: 'Emails', id: 'email-tab', 'order': 9 },
  { name: 'Support', id: 'support-tab', 'order': 10 },
  { name: 'Documents', id: 'documents-tab', 'order': 11 },
  { name: 'RFI', id: 'rfi-tab', 'order': 12 },
];

export const SiteTopTabLists = [
  // {name: 'Details', id: 'account-details', 'order': 1},
  { name: 'Sites', id: 'site-tab', 'order': 2 },
  { name: 'Contacts', id: 'contact-tab', 'order': 7 },
  { name: 'Equipment', id: 'equipment-tab', 'order': 3 },
  { name: 'Training', id: 'training-tab', 'order': 4 },
  { name: 'Inperson', id: 'inperson-tab', 'order': 5 },
  { name: 'Classes', id: 'classes-tab', 'order': 5 },
  // { name: 'POPS', id: 'pop-tab', 'order': 6 },
  // { name: 'Contacts', id: 'contact-tab', 'order': 7 },
  { name: 'Notes', id: 'notes-tab', 'order': 8 },
  { name: 'Emails', id: 'email-tab', 'order': 9 },
  { name: 'Support', id: 'support-tab', 'order': 10 },
  { name: 'Documents', id: 'documents-tab', 'order': 11 },
  { name: 'RFI', id: 'rfi-tab', 'order': 12 },
];

export const EquipmentTopTabLists = [
  {name: 'Details', id: 'aed-details', 'order': 1},
  { name: 'Notes', id: 'notes-tab', 'order': 2 },
  // { name: 'Emails', id: 'email-tab', 'order': 9 },
  // { name: 'Support', id: 'support-tab', 'order': 10 },
  // { name: 'Documents', id: 'documents-tab', 'order': 11 },
  // { name: 'RFI', id: 'rfi-tab', 'order': 12 },
];

export const filteredDetailsTabs = (array) => {
  return MainDashboardTopTabLists.filter(item =>
    array.some(({ name }) => name === item.name)
  );
}

export const filteredSiteTabs = (array) => {
  return SiteTopTabLists.filter(item =>
    array.some(({ name }) => name === item.name)
  );
}

export const filteredEquipmentTabs = (array) => {
  return EquipmentTopTabLists.filter(item =>
    array.some(({ name }) => name === item.name)
  );
}

export const SiteDetailsTabList = [
  { name: 'Sites', id: 'site-tab' },
];

export const sortArrAscending = (arr, key) => {
  const result = arr.sort((a, b) => {
    const valA = a[key]?.trim().toLowerCase();
    const valB = b[key]?.trim().toLowerCase();
    return (valA < valB) ? -1 : (valA > valB) ? 1 : 0;
  });
  return result;
}

export const removeBlankObj = (arr, key) => {
  if (arr) {
    const filteredArray = arr.filter(obj => obj[key]);
    return filteredArray
  }
}
