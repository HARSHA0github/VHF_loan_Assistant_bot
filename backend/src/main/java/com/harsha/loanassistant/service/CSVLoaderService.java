package com.harsha.loanassistant.service;

import com.harsha.loanassistant.entity.LoanQA;
import com.harsha.loanassistant.repository.LoanQARepository;
import com.opencsv.CSVReader;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStreamReader;

@Service
public class CSVLoaderService {

    @Autowired
    private LoanQARepository repository;



    @PostConstruct
    public void loadCSV() {

        System.out.println("CSV LOADER STARTED !!!");

        try {

            // prevent duplicate loading
            if(repository.count() > 0) {

                return;
            }

            ClassPathResource resource = new ClassPathResource("Q&A.csv");

            CSVReader reader = new CSVReader(
                    new InputStreamReader(resource.getInputStream())
            );

            String[] line;

            while((line = reader.readNext()) != null) {

                if(line.length >= 3) {

                    LoanQA qa = new LoanQA();
                    qa.setQuestion(line[1].replace("Q:", "").trim());
                    qa.setAnswer(line[2].replace("A:", "").trim());


                    repository.save(qa);
                    System.out.println("Inserted: " + qa.getQuestion());
                }
            }

            System.out.println("CSV DATA LOADED SUCCESSFULLY");

        } catch(Exception e) {
            e.printStackTrace();
        }

    }
}
