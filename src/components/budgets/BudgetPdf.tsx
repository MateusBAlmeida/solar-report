"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

type BudgetItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  position: number;
};

export type BudgetPdfData = {
  number: string;
  companyName: string;
  companyCnpj: string | null;
  companyAddress: string | null;
  companyPhone: string | null;
  companyEmail: string | null;
  clientName: string;
  projectTitle: string;
  activitiesDescription: string | null;
  observations: string | null;
  paymentConditions: string | null;
  total: number;
  createdAt: string;
  items: BudgetItem[];
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));

/** Quebra texto por linhas e remove marcadores vazios */
const toLines = (text: string | null) =>
  (text ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

const styles = StyleSheet.create({
  page: {
    paddingTop: 38,
    paddingBottom: 48,
    paddingHorizontal: 42,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#222222",
  },
  // Cabeçalho da empresa (uma linha, como no DOCX)
  companyHeader: {
    fontSize: 8,
    lineHeight: 1.4,
    marginBottom: 18,
  },
  companyName: {
    fontFamily: "Helvetica-Bold",
  },
  projectTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    marginBottom: 14,
  },
  clientBlock: {
    marginBottom: 16,
  },
  clientLabel: {
    fontFamily: "Helvetica-Bold",
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    marginBottom: 7,
  },
  bulletList: {
    marginBottom: 15,
  },
  bulletLine: {
    fontSize: 10,
    lineHeight: 1.5,
    flexDirection: "row",
    marginBottom: 4,
  },
  bullet: {
    width: 12,
  },
  bulletText: {
    flex: 1,
  },
  paragraph: {
    fontSize: 10,
    lineHeight: 1.5,
    marginBottom: 15,
  },
  table: {
    marginTop: 4,
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#eeeeee",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#777777",
    paddingVertical: 7,
    paddingHorizontal: 5,
    fontFamily: "Helvetica-Bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#bbbbbb",
    paddingVertical: 7,
    paddingHorizontal: 5,
  },
  description: { width: "48%", paddingRight: 5 },
  quantity: { width: "12%", textAlign: "right" },
  unitPrice: { width: "20%", textAlign: "right" },
  subtotal: { width: "20%", textAlign: "right" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    borderTopWidth: 1.5,
    borderColor: "#333333",
    paddingTop: 8,
    marginTop: 2,
  },
  totalLabel: {
    fontFamily: "Helvetica-Bold",
    marginRight: 18,
  },
  totalValue: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
  },
  section: {
    marginBottom: 15,
  },
  signatureArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 42,
  },
  signature: {
    width: "43%",
    borderTopWidth: 0.8,
    borderTopColor: "#555555",
    paddingTop: 7,
    textAlign: "center",
    fontSize: 9,
  },
  date: {
    marginTop: 25,
    textAlign: "right",
    fontSize: 9,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 42,
    right: 42,
    textAlign: "center",
    fontSize: 8,
    color: "#666666",
  },
});

function BudgetDocument({ budget }: { budget: BudgetPdfData }) {
  const sortedItems = [...budget.items].sort((a, b) => a.position - b.position);
  const activities = toLines(budget.activitiesDescription);
  const observations = toLines(budget.observations);
  const paymentConditions = toLines(budget.paymentConditions);

  return (
    <Document
      title={`${budget.number} - ${budget.projectTitle}`}
      author={budget.companyName}
      subject="Orçamento"
    >
      <Page size="A4" style={styles.page} wrap>
        {/* Cabeçalho — uma linha como no DOCX */}
        <Text style={styles.companyHeader}>
          <Text style={styles.companyName}>{budget.companyName} </Text>
          {budget.companyCnpj && <>CNPJ: {budget.companyCnpj}. </>}
          {budget.companyAddress && <>{budget.companyAddress}. </>}
          {budget.companyPhone && <>Tel.: {budget.companyPhone}. </>}
          {budget.companyEmail && <>E-mail: {budget.companyEmail}.</>}
        </Text>

        {/* Título do projeto */}
        <Text style={styles.projectTitle}>{budget.projectTitle}</Text>

        {/* Cliente */}
        <Text style={styles.clientBlock}>
          <Text style={styles.clientLabel}>CLIENTE</Text>
          {"  "}
          {budget.clientName}
        </Text>

        {/* Descrição das atividades (com bullets) */}
        {activities.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descrição das atividades</Text>
            <View style={styles.bulletList}>
              {activities.map((line, i) => (
                <View key={i} style={styles.bulletLine} wrap={false}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>{line}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Preços */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preços</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.description}>ITEM</Text>
              <Text style={styles.quantity}>QUANTIDADE</Text>
              <Text style={styles.unitPrice}>VALOR</Text>
              <Text style={styles.subtotal}>SUBTOTAL</Text>
            </View>
            {sortedItems.map((item) => (
              <View key={item.id} style={styles.tableRow} wrap={false}>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <Text style={styles.unitPrice}>{formatCurrency(item.unitPrice)}</Text>
                <Text style={styles.subtotal}>{formatCurrency(item.subtotal)}</Text>
              </View>
            ))}
            <View style={styles.totalRow} wrap={false}>
              <Text style={styles.totalLabel}>TOTAL</Text>
              <Text style={styles.totalValue}>{formatCurrency(budget.total)}</Text>
            </View>
          </View>
        </View>

        {/* Observações */}
        {observations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observações</Text>
            <View style={styles.bulletList}>
              {observations.map((line, i) => (
                <View key={i} style={styles.bulletLine} wrap={false}>
                  <Text style={styles.bulletText}>{line}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Condições de contrato */}
        {paymentConditions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Condições de contrato</Text>
            <View style={styles.bulletList}>
              {paymentConditions.map((line, i) => (
                <View key={i} style={styles.bulletLine} wrap={false}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>{line}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Assinaturas */}
        <View style={styles.signatureArea} wrap={false}>
          <View style={styles.signature}>
            <Text>{budget.clientName}</Text>
            <Text>Cliente</Text>
          </View>
          <View style={styles.signature}>
            <Text>{budget.companyName}</Text>
            <Text>Responsável pelo orçamento</Text>
          </View>
        </View>

        <Text style={styles.date}>{formatDate(budget.createdAt)}</Text>

        <Text
          style={styles.footer}
          fixed
          render={({ pageNumber, totalPages }) =>
            `Orçamento ${budget.number} • Página ${pageNumber} de ${totalPages}`
          }
        />
      </Page>
    </Document>
  );
}

export function BudgetPdfDownload({ budget }: { budget: BudgetPdfData }) {
  const filename = `${budget.number.replaceAll("/", "-")}.pdf`;

  return (
    <PDFDownloadLink
      document={<BudgetDocument budget={budget} />}
      fileName={filename}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        borderRadius: 8,
        backgroundColor: "#171717",
        color: "#ffffff",
        padding: "10px 16px",
        fontSize: 14,
        fontWeight: 500,
        textDecoration: "none",
      }}
    >
      {({ loading }) => (loading ? "Gerando PDF..." : "Baixar PDF")}
    </PDFDownloadLink>
  );
}