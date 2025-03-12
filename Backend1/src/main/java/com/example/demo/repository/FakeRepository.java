package com.example.demo.repository;



import com.example.demo.model.Fake;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FakeRepository extends JpaRepository<Fake, Long> {
    Optional<Fake> findByEmail(String email);
}
