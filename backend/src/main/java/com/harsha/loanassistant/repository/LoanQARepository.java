package com.harsha.loanassistant.repository;

import com.harsha.loanassistant.entity.LoanQA;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;



@Repository
public interface LoanQARepository extends JpaRepository<LoanQA, Long> {




    Optional<LoanQA> findFirstByQuestionContainingIgnoreCase(String question);


}

