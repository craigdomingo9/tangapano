from abc import ABC, abstractmethod

class IBackupSystem(ABC):
    @abstractmethod
    def run_cycle(self):
        """
        Executes the full backup lifecycle for this specific system configuration.
        """
        pass