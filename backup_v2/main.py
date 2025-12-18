from systems import PostgresMegaSystem, ImageBackupSystem


def main():
    
    systems = [
        PostgresMegaSystem(),
        ImageBackupSystem(),
    ]
    
    for system in systems:
        system.run_cycle()
        
    
if __name__ == "__main__":
    main()


