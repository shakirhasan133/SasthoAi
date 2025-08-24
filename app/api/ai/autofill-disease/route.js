import { NextResponse } from 'next/server';
import { getAIResponse } from '../../../../lib/ai';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const { diseaseName } = await request.json();

    if (!diseaseName) {
      console.error('API Error: Disease name is required');
      return NextResponse.json({ error: 'Disease name is required' }, { status: 400 });
    }

    const prompt = `Generate comprehensive information for the disease "${diseaseName}" in JSON format, following this structure. Provide accurate and relevant data. If a field is an array, provide multiple relevant items. For statistics, provide plausible values if exact figures are hard to find, or state 'N/A' if not applicable/unknown.\n    \n    {\n      \"disease_name\": \"Disease Name (e.g., Common Cold)\",\n      \"overview\": \"Brief description of the disease.\",\n      \"causes\": [\"Cause 1\", \"Cause 2\"]\n      \"symptoms\": [\"Symptom 1\", \"Symptom 2\"]\n      \"risk_factors\": [\"Risk Factor 1\", \"Risk Factor 2\"]\n      \"diagnosis\": [\"Diagnostic Method 1\", \"Diagnostic Method 2\"]\n      \"treatments\": {\n        \"lifestyle\": [\"Lifestyle Change 1\", \"Lifestyle Change 2\"]\n        \"medications\": [\"Medication 1\", \"Medication 2\"]\n        \"therapies\": [\"Therapy 1\"]\n        \"surgery\": [\"Surgery 1\"]\n      },\n      \"prevention\": [\"Prevention Method 1\", \"Prevention Method 2\"]\n      \"complications\": [\"Complication 1\", \"Complication 2\"]\n      \"stages\": [\"Stage 1\", \"Stage 2\"]\n      \"prognosis\": \"Typical outcome and outlook.\",\n      \"when_to_see_doctor\": [\"Condition to see doctor 1\", \"Condition to see doctor 2\"]\n      \"emergency_signs\": [\"Emergency Sign 1\", \"Emergency Sign 2\"]\n      \"related_diseases\": [\"Related Disease 1\", \"Related Disease 2\"]\n      \"affected_body_parts\": [\"Body Part 1\", \"Body Part 2\"]\n      \"statistics\": {\n        \"global_cases\": \"e.g., Billions annually\",\n        \"annual_deaths\": \"e.g., Low\",\n        \"prevalence_rate\": \"e.g., Very High\"\n      },\n      \"references\": [\n        {\n          \"source\": \"Reference Source 1\",\n          \"url\": \"https://example.com/ref1\"\n        }\n      ]\n    }\`;

    console.log(`Sending prompt to AI for disease: ${diseaseName}`);
    let aiResponse = await getAIResponse(prompt);
    console.log('AI Raw Response:', aiResponse);

    // Remove markdown code block fences if present
    if (typeof aiResponse === 'string' && aiResponse.startsWith('```json') && aiResponse.endsWith('```')) {
      aiResponse = aiResponse.substring(7, aiResponse.length - 3).trim();
      console.log('AI Response after stripping markdown:', aiResponse);
    }

    // Attempt to parse the AI response as JSON
    let parsedData;
    try {
      parsedData = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      console.error('AI Raw Response (unparseable):', aiResponse);
      return NextResponse.json({ error: 'Failed to parse AI response as JSON', rawResponse: aiResponse }, { status: 500 });
    }

    // Helper to normalize array fields from AI response
    const normalizeArrayField = (value) => {
        if (Array.isArray(value)) return value.filter(Boolean);
        if (typeof value === 'string' && value.trim() !== '') return value.split(',').map(s => s.trim()).filter(Boolean);
        if (value) return [String(value)]; // Handle single non-empty string as a single-item array
        return [];
    };
    
    // Helper to normalize object fields that contain arrays (like treatments)
    const normalizeTreatments = (treatmentsObj) => {
      const normalized = {};
      if (treatmentsObj) {
        normalized.lifestyle = normalizeArrayField(treatmentsObj.lifestyle);
        normalized.medications = normalizeArrayField(treatmentsObj.medications);
        normalized.therapies = normalizeArrayField(treatmentsObj.therapies);
        normalized.surgery = normalizeArrayField(treatmentsObj.surgery);
      }
      return normalized;
    };

    // Helper to normalize statistics object
    const normalizeStatistics = (statsObj) => {
      const normalized = {
        global_cases: '',
        annual_deaths: '',
        prevalence_rate: '',
      };
      if (statsObj) {
        normalized.global_cases = statsObj.global_cases || '';
        normalized.annual_deaths = statsObj.annual_deaths || '';
        normalized.prevalence_rate = statsObj.prevalence_rate || '';
      }
      return normalized;
    };

    // Helper to normalize references array
    const normalizeReferences = (refsArray) => {
      if (!Array.isArray(refsArray)) return [];
      return refsArray.map(ref => ({
        source: ref.source || '',
        url: ref.url || '',
      })).filter(ref => ref.source || ref.url);
    };


    const normalizedData = {
        disease_name: parsedData.disease_name || diseaseName, 
        overview: parsedData.overview || '',
        causes: normalizeArrayField(parsedData.causes),
        symptoms: normalizeArrayField(parsedData.symptoms),
        risk_factors: normalizeArrayField(parsedData.risk_factors),
        diagnosis: normalizeArrayField(parsedData.diagnosis),
        prevention: normalizeArrayField(parsedData.prevention),
        complications: normalizeArrayField(parsedData.complications),
        stages: normalizeArrayField(parsedData.stages),
        prognosis: parsedData.prognosis || '',
        when_to_see_doctor: normalizeArrayField(parsedData.when_to_see_doctor),
        emergency_signs: normalizeArrayField(parsedData.emergency_signs),
        related_diseases: normalizeArrayField(parsedData.related_diseases),
        affected_body_parts: normalizeArrayField(parsedData.affected_body_parts),
        
        treatments: normalizeTreatments(parsedData.treatments),
        statistics: normalizeStatistics(parsedData.statistics),
        references: normalizeReferences(parsedData.references),
    };
    console.log('Normalized AI Data for Frontend:', normalizedData);

    return NextResponse.json(normalizedData);
  } catch (error) {
    console.error('Error in AI autofill API:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
