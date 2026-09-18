package com.harsha.loanassistant.entity;

import jakarta.persistence.*;

@Entity
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String income;
    private String cibil;
    private String eligibility;

    // ===== GETTERS & SETTERS =====

    public Long getId() {
        return id;
    }

    public String getIncome() {
        return income;
    }

    public void setIncome(String income) {
        this.income = income;
    }

    public String getCibil() {
        return cibil;
    }

    public void setCibil(String cibil) {
        this.cibil = cibil;
    }

    public String getEligibility() {
        return eligibility;
    }

    public void setEligibility(String eligibility) {
        this.eligibility = eligibility;
    }
}

