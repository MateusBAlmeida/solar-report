import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
} from '@react-pdf/renderer'


type Props = {
    customerName: string
    city: string
    state: string

    averageConsumption: number
    systemPower: number
    panels: number
    roofArea: number
    monthlySavings: number
    estimatedGeneration: number
    monthlyGeneration: number[]
    chartImage?: string
}

const styles = StyleSheet.create({

    page: {
        padding: 40,
        fontSize: 12,
        fontFamily: 'Helvetica'
    },

    header: {
        marginBottom: 30
    },

    title: {
        fontSize: 28,
        marginBottom: 8,
        fontWeight: 'bold'
    },

    subtitle: {
        fontSize: 14,
        color: '#666'
    },

    section: {
        marginBottom: 24
    },

    sectionTitle: {
        fontSize: 18,
        marginBottom: 12,
        fontWeight: 'bold'
    },

    cardGrid: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12
    },

    card: {
        width: '48%',
        padding: 16,
        borderRadius: 8,
        border: '1 solid #DDD'
    },

    cardTitle: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8
    },

    cardValue: {
        fontSize: 22,
        fontWeight: 'bold'
    },

    footer: {
        marginTop: 40,
        textAlign: 'center',
        color: '#888',
        fontSize: 10
    },

    chart: {
        marginTop: 20,
        width: '100%',
        height: 250,
        objectFit: 'contain'
    },

    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: 12
    },
})

export function ReportDocument({
    customerName,
    city,
    state,
    averageConsumption,
    systemPower,
    panels,
    roofArea,
    monthlySavings,
    estimatedGeneration,
    monthlyGeneration,
    chartImage
}: Props) {

    const yearlySavings =
        monthlySavings * 12

    return (
        <Document>

            <Page
                size="A4"
                style={styles.page}
            >

                {/* HEADER */}

                <View style={styles.header}>

                    <Text style={styles.title}>
                        Relatório Fotovoltaico
                    </Text>

                    <Text style={styles.subtitle}>
                        Simulação de geração solar
                    </Text>

                </View>

                {/* CLIENTE */}

                <View style={styles.section}>

                    <Text style={styles.sectionTitle}>
                        Dados do Cliente
                    </Text>

                    <Text>
                        Cliente: {customerName}
                    </Text>

                    <Text>
                        Cidade: {city} - {state}
                    </Text>

                </View>

                {/* RESULTADOS */}

                <View style={styles.section}>

                    <Text style={styles.sectionTitle}>
                        Resultado da Simulação
                    </Text>

                    <View style={styles.cardGrid}>

                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>
                                Consumo Médio
                            </Text>

                            <Text style={styles.cardValue}>
                                {averageConsumption.toFixed(2).replace('.', ',')} kWh
                            </Text>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>
                                Potência do Sistema
                            </Text>

                            <Text style={styles.cardValue}>
                                {systemPower.toFixed(2).replace('.', ',')} kWp
                            </Text>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>
                                Quantidade de Placas
                            </Text>

                            <Text style={styles.cardValue}>
                                {panels}
                            </Text>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>
                                Área Necessária
                            </Text>

                            <Text style={styles.cardValue}>
                                {roofArea.toFixed(1).replace('.', ',')} m²
                            </Text>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>
                                Geração Estimada
                            </Text>

                            <Text style={styles.cardValue}>
                                {estimatedGeneration.toFixed(2).replace('.', ',')} kWh/mês
                            </Text>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>
                                Cobertura Estimada
                            </Text>

                            <Text style={styles.cardValue}>
                                {(
                                    (estimatedGeneration /
                                        averageConsumption) * 100
                                ).toFixed(0)}%
                            </Text>
                        </View>

                    </View>
                </View>

                {/* ECONOMIA */}

                <View style={styles.section}>

                    <Text style={styles.sectionTitle}>
                        Economia Estimada
                    </Text>

                    <Text>
                        Economia mensal:
                        R$ {monthlySavings.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                    </Text>

                    <Text>
                        Economia anual:
                        R$ {yearlySavings.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                    </Text>

                </View>

                {/* COMPARATIVO ENERGÉTICO */}
                <View style={styles.section}>

                    <Text style={styles.sectionTitle}>
                        Comparativo Energético
                    </Text>

                    <Text>
                        Consumo médio atual:
                        {averageConsumption.toFixed(2).replace('.', ',')} kWh/mês
                    </Text>

                    <Text>
                        Geração estimada:
                        {estimatedGeneration.toFixed(2).replace('.', ',')} kWh/mês
                    </Text>

                    <Text>
                        Cobertura estimada:
                        {(
                            (estimatedGeneration /
                                averageConsumption) * 100
                        ).toFixed(0)}%
                    </Text>

                </View>

                <View style={styles.table}>
                    <Text style={{ ...styles.cardTitle, marginBottom: 8 }}>
                        Geração Mensal Estimada
                    </Text>
                    <View style={{ display: 'flex', flexDirection: 'row', borderBottom: '1 solid #DDD' }}>
                        <Text style={{ width: '50%', padding: 8, borderRight: '1 solid #DDD', fontWeight: 'bold' }}>
                            Mês
                        </Text>
                        <Text style={{ width: '50%', padding: 8, fontWeight: 'bold' }}>
                            Geração Estimada (kWh)
                        </Text>
                    </View>
                    {monthlyGeneration.map((value, index) => (
                        <View key={index} style={{ display: 'flex', flexDirection: 'row', borderBottom: '1 solid #EEE' }}>
                            <Text style={{ width: '50%', padding: 8, borderRight: '1 solid #EEE' }}>
                                {`Mês ${index + 1}`}
                            </Text>
                            <Text style={{ width: '50%', padding: 8 }}>
                                {value.toFixed(2).replace('.', ',')}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* GRÁFICO DE CONSUMO */}
                {
                    chartImage && (

                        <View style={styles.section}>

                            <Text style={styles.sectionTitle}>
                                Consumo x Geração
                            </Text>

                            <Image
                                src={chartImage}
                                style={styles.chart}
                            />

                        </View>
                    )
                }

                {/* RODAPÉ */}

                <View style={styles.footer}>

                    <Text>
                        Relatório gerado automaticamente
                    </Text>

                </View>

            </Page>
        </Document>
    )
}