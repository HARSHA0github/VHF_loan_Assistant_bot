package com.harsha.loanassistant.repository;

import com.harsha.loanassistant.entity.KycRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KycRecordRepository extends JpaRepository<KycRecord, Long> {
}
