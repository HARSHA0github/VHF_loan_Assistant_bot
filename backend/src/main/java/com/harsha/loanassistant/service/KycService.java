package com.harsha.loanassistant.service;

import com.harsha.loanassistant.entity.KycRecord;
import com.harsha.loanassistant.repository.KycRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.InputStream;

@Service
public class KycService {

    @Autowired
    private KycRecordRepository kycRecordRepository;

    public String processKyc(MultipartFile file, String password) {
        try {
            InputStream inputStream = file.getInputStream();

            // Setup secure Document Builder
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            factory.setNamespaceAware(true);
            factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
            factory.setFeature("http://xml.org/sax/features/external-general-entities", false);
            factory.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
            factory.setXIncludeAware(false);
            factory.setExpandEntityReferences(false);
            
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document doc = builder.parse(inputStream);
            doc.getDocumentElement().normalize();

            // 1. Extract Name and Mobile Hash
            Element poi = (Element) doc.getElementsByTagName("Poi").item(0);
            String name = poi != null && poi.hasAttribute("name") ? poi.getAttribute("name") : "Unknown";
            String mobileHash = poi != null && poi.hasAttribute("m") ? poi.getAttribute("m") : null;

            // 2. Extract Address
            Element poa = (Element) doc.getElementsByTagName("Poa").item(0);
            String address = "Address not found";
            if (poa != null) {
                StringBuilder addrBuilder = new StringBuilder();
                String[] fields = {"house", "street", "loc", "dist", "state", "pc"};
                for (String field : fields) {
                    if (poa.hasAttribute(field)) {
                        addrBuilder.append(poa.getAttribute(field)).append(", ");
                    }
                }
                if (addrBuilder.length() > 0) {
                    address = addrBuilder.substring(0, addrBuilder.length() - 2);
                }
            }

            // 3. Save to Database
            KycRecord record = new KycRecord(name, address, mobileHash);
            kycRecordRepository.save(record);

            // 4. Build success message for the LLM
            StringBuilder result = new StringBuilder();
            result.append("KYC Verified for ").append(name).append(".\n");
            result.append("Address: ").append(address).append(".\n");
            if (mobileHash != null) {
                result.append("Mobile Number hash is present and verified.\n");
            }

            return result.toString();

        } catch (Exception e) {
            e.printStackTrace();
            return "KYC Parsing failed: " + e.getMessage();
        }
    }
}
