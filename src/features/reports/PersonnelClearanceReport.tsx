import React, { useState, useMemo } from 'react';
import { useFirearmStore } from '../../store/useFirearmStore';
import { usePersonnelStore } from '../../store/usePersonnelStore';
import { Search, Download, Printer } from 'lucide-react';
import { Document, Page, Text, View, StyleSheet, PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { formatDate } from '../../utils/date';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 12, color: '#1e293b' },
  header: { marginBottom: 30, textAlign: 'center', borderBottom: '2px solid #1e3a8a', paddingBottom: 15 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 5 },
  subtitle: { fontSize: 12, color: '#64748b' },
  section: { marginBottom: 20 },
  label: { fontSize: 10, color: '#64748b', marginBottom: 3, textTransform: 'uppercase' },
  value: { fontSize: 14, fontWeight: 'bold', marginBottom: 15 },
  table: { display: 'flex', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderColor: '#cbd5e1', borderRightWidth: 0, borderBottomWidth: 0 },
  tableRow: { margin: 'auto', flexDirection: 'row' },
  tableColHeader: { width: '25%', borderStyle: 'solid', borderWidth: 1, borderColor: '#cbd5e1', borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#f1f5f9', padding: 5 },
  tableCol: { width: '25%', borderStyle: 'solid', borderWidth: 1, borderColor: '#cbd5e1', borderLeftWidth: 0, borderTopWidth: 0, padding: 5 },
  tableCellHeader: { margin: 2, fontSize: 10, fontWeight: 'bold' },
  tableCell: { margin: 2, fontSize: 10 },
  signatures: { marginTop: 50, flexDirection: 'row', justifyContent: 'space-between' },
  signBox: { width: '40%' },
  signLine: { borderBottom: '1px solid #000', marginBottom: 5, marginTop: 40 },
  signText: { fontSize: 10, textAlign: 'center' }
});

const ClearancePDF = ({ personnelId, firearms, date }: { personnelId: string, firearms: any[], date: string }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>PHILIPPINE NATIONAL POLICE</Text>
        <Text style={styles.subtitle}>Camp Crame Armory Division</Text>
        <Text style={{ marginTop: 15, fontSize: 16, fontWeight: 'bold' }}>PERSONNEL PROPERTY CLEARANCE</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.label}>Issued To (Personnel ID / Name)</Text>
        <Text style={styles.value}>{personnelId}</Text>
        <Text style={styles.label}>Date Generated</Text>
        <Text style={styles.value}>{date}</Text>
      </View>

      <View style={styles.section}>
        <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 10 }}>Accounted Firearms ({firearms.length})</Text>
        {firearms.length > 0 ? (
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Serial Number</Text></View>
              <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Make</Text></View>
              <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Model</Text></View>
              <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Caliber</Text></View>
            </View>
            {firearms.map((f: any) => (
              <View style={styles.tableRow} key={f.id}>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{f.serialNumber}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{f.make}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{f.model}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{f.caliber}</Text></View>
              </View>
            ))}
          </View>
        ) : (
          <Text style={{ fontSize: 11, fontStyle: 'italic', color: '#64748b' }}>No firearms currently deployed to this personnel.</Text>
        )}
      </View>

      <View style={styles.signatures}>
        <View style={styles.signBox}>
          <View style={styles.signLine} />
          <Text style={styles.signText}>Signature of Officer</Text>
          <Text style={{ ...styles.signText, marginTop: 3 }}>Date: ________________</Text>
        </View>
        <View style={styles.signBox}>
          <View style={styles.signLine} />
          <Text style={styles.signText}>Armory Officer-in-Charge</Text>
          <Text style={{ ...styles.signText, marginTop: 3 }}>Date: ________________</Text>
        </View>
      </View>
      
      <Text style={{ position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', color: '#94a3b8', fontSize: 8 }}>
        This document serves as an official accounting of property. Any discrepancies must be reported immediately.
      </Text>
    </Page>
  </Document>
);

export function PersonnelClearanceReport() {
  const firearms = useFirearmStore(state => state.firearms);
  const personnel = usePersonnelStore(state => state.personnel);
  const [selectedPersonnelId, setSelectedPersonnelId] = useState('');
  
  const selectedPersonnel = useMemo(() => personnel.find(p => p.id === selectedPersonnelId), [personnel, selectedPersonnelId]);

  const assignedFirearms = useMemo(() => {
    if (!selectedPersonnel) return [];
    
    // Check if the assignee string matches the formatted badge/name or if it's an exact match
    return firearms.filter(f => 
      f.currentStatus === 'Deployed' && 
      f.assigneePersonnelId && 
      f.assigneePersonnelId.includes(selectedPersonnel.badgeNumber)
    );
  }, [firearms, selectedPersonnel]);

  const currentDate = formatDate(new Date().toISOString());

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-apple p-6 shrink-0 transition-colors">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Personnel Property Clearance</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-2xl">
          Generate a formal clearance document for an officer. This PDF guarantees the current state of their deployed weapons for official HR and Logistics filing.
        </p>
        
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <select
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pnp-navy dark:focus:ring-blue-500 transition-all dark:text-white appearance-none"
              value={selectedPersonnelId}
              onChange={e => setSelectedPersonnelId(e.target.value)}
            >
              <option value="" disabled>Select officer...</option>
              {personnel.map(p => (
                <option key={p.id} value={p.id}>
                  {p.rank} {p.lastName}, {p.firstName} ({p.badgeNumber})
                </option>
              ))}
            </select>
          </div>
          
          {selectedPersonnel && (
            <PDFDownloadLink
              document={<ClearancePDF personnelId={`${selectedPersonnel.rank} ${selectedPersonnel.lastName}, ${selectedPersonnel.firstName} (${selectedPersonnel.badgeNumber})`} firearms={assignedFirearms} date={currentDate} />}
              fileName={`clearance_${selectedPersonnel.badgeNumber}.pdf`}
              className="flex items-center gap-2 px-5 py-3 bg-pnp-navy dark:bg-blue-600 hover:bg-pnp-navy-light dark:hover:bg-blue-500 text-white rounded-xl transition-colors font-semibold text-sm shadow-sm cursor-pointer whitespace-nowrap"
            >
              {({ loading }) => loading ? 'Generating PDF...' : <><Download size={18} /> Download Official PDF</>}
            </PDFDownloadLink>
          )}
        </div>
      </div>

      {selectedPersonnel ? (
        <div className="bg-slate-100 dark:bg-slate-900 flex-1 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner p-2 min-h-[850px] flex flex-col">
          <div className="px-4 py-2 flex items-center justify-between text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-xl mb-2 shrink-0">
            <span className="text-sm font-medium flex items-center gap-2"><Printer size={16} /> Live Print Preview</span>
            <span className="text-xs">100% Scale (A4)</span>
          </div>
          <div className="flex-1 rounded-xl overflow-hidden shadow-md">
            <PDFViewer style={{ width: '100%', height: '100%', minHeight: '800px', border: 'none' }}>
              <ClearancePDF personnelId={`${selectedPersonnel.rank} ${selectedPersonnel.lastName}, ${selectedPersonnel.firstName} (${selectedPersonnel.badgeNumber})`} firearms={assignedFirearms} date={currentDate} />
            </PDFViewer>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl min-h-[400px]">
          <Printer size={48} className="mb-4 opacity-50" />
          <p>Enter an officer's name to generate the report preview.</p>
        </div>
      )}
    </div>
  );
}
